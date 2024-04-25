import { useEffect, useState } from 'react';
import '../css/App.css';
import BallRow from './BallRow';
import Modal from './Modal';
import AirtableHandler from '../airtableHandler';

interface Attempt {
	balls: Array<number>;
	hints: Array<number>;
}

export type GameStatus = 'play' | 'win' | 'lose' | 'wait';

const MAX_ATTEMPTS = 8;

const App = () => {
	const [answer, setAnswer] = useState<Array<number>>(makeAnswer());
	const [attempts, setAttempts] = useState<Array<Attempt>>(clearAttempts());
	const [currentAttempt, setCurrentAttempt] = useState(0);
	const [gameStatus, setGameStatus] = useState<GameStatus>('wait');
	const [showMenu, setShowMenu] = useState(true);
	const [showHowToPlay, setShowHowToPlay] = useState(false);
	const [languageData, setLanguageData] = useState();
	const [languages, setLanguages] = useState<Array<Object>>([]);
	const [currentLanguage, setCurrentLanguage] = useState('pt-BR');

	useEffect(() => {
		AirtableHandler.getLanguages(langs => setLanguages(langs));
	}, []);

	useEffect(() => {
		AirtableHandler.getLanguageData(currentLanguage, data => {
			setLanguageData(data);
		});
	}, [currentLanguage]);

	function makeAnswer(): Array<number> {
		const numbers = [0, 1, 2, 3, 4, 5];
		const result = [];
		for (let i = 0; i < 4; i++) {
			result.push(numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0]);
		}
		return result;
	}

	function clearAttempts(): Array<Attempt> {
		const result = [];
		for (let i = 0; i < MAX_ATTEMPTS; i++) {
			result.push({
				balls: [-3, -3, -3, -3],
				hints: [-3, -3, -3, -3]
			});
		}
		return result;
	}

	const handleEnterClick = () => {
		const attempt = attempts[currentAttempt];
		attempt.hints = attempts[currentAttempt].balls.map((ball, idx) => {
			if (ball === answer[idx]) {
				return -1;
			} else if (answer.includes(ball)) {
				return -2;
			} else {
				return -3;
			}
		});
		attempt.hints.sort();
		const nextAttempts = attempts.map((att, idx) => idx === currentAttempt ? attempt : att);
		setAttempts(nextAttempts);
		if (attempt.hints.every(colorIdx => colorIdx === -1)) {
			setGameStatus('win');
		} else if (currentAttempt === MAX_ATTEMPTS - 1) {
			setGameStatus('lose');
		} else {
			setCurrentAttempt(currentAttempt + 1);
		}
	}

	const handlePieMenuClick = (ballIdx: number, colorIdx: number) => {
		const attempt = attempts[currentAttempt];
		attempt.balls[ballIdx] = colorIdx;
		const nextAttempts = attempts.map((att, idx) => idx === currentAttempt ? attempt : att);
		setAttempts(nextAttempts);
	}

	const handleNewGameClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setAnswer(makeAnswer());
		setAttempts(clearAttempts());
		setGameStatus('play');
		setShowMenu(false);
	}

	const handleShowSolutionClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setGameStatus('wait');
		setShowMenu(false);
	}

	const handleHowToPlayClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setShowHowToPlay(true);
		setShowMenu(false);
	}

	const strToJSX = (str: string): JSX.Element => {
		return <span dangerouslySetInnerHTML={{ __html: str }}></span>
	}

	return (
		<div className="App">
			<div className="Codebreaker">
				<header>
					<div className="title">
						<h1>Codebreaker</h1>
						<nav onClick={() => setShowMenu(true)}>
							<div className={`menu${showMenu ? '' : ' hidden'}`}>
								<ul>
									{languageData && <li onClick={handleNewGameClick}>{languageData['menu_new_game']}</li>}
									{languageData && <li onClick={handleShowSolutionClick}>{languageData['menu_show_solution']}</li>}
									{languageData && <li onClick={handleHowToPlayClick}>{languageData['menu_how_to_play']}</li>}
									<li className="li-select">
										<select onChange={e => setCurrentLanguage(e.target.value)}>
											{languages && languages.map((language: any) => (
												<option
													key={language.shortName}
													value={language.shortName}
												>{language.name}</option>
											))}
										</select>
									</li>
								</ul>
							</div>
						</nav>
					</div>
					<BallRow
						header
						balls={answer}
						gameStatus={gameStatus}
					/>
				</header>
				<section className="play-area">
					{attempts.map((attempt, idx) => (
						<BallRow
							key={idx}
							current={currentAttempt === idx && gameStatus === 'play'}
							balls={attempt.balls}
							hints={attempt.hints}
							gameStatus={gameStatus}
							onEnterClick={handleEnterClick}
							onPieMenuClick={handlePieMenuClick}
						/>
					))}
				</section>
				{(gameStatus === 'win' || gameStatus === 'lose') && languageData && <Modal
					title={gameStatus === 'win' ? languageData['modal_win_title'] : languageData['modal_lose_title']}
				>
					<div className="modal-content">
						{gameStatus === 'win' && languageData && <p>{strToJSX(languageData['modal_win_text'])}</p>}
						{gameStatus === 'lose' && languageData && <p>{strToJSX(languageData['modal_lose_text'])}</p>}
						{/* {gameStatus === 'lose' && <p>Você não conseguiu{'\n'}decifrar o código.</p>} */}
						<button
							className="modal-btn"
							onClick={() => setGameStatus('wait')}
						>OK</button>
					</div>
				</Modal>}
				{showHowToPlay && <Modal title="Como jogar">
					<div className="modal-content how-to-play">
						{languageData && strToJSX(languageData['modal_how_to_play'])}
						<button
							className="modal-btn"
							onClick={() => setShowHowToPlay(false)}
						>OK</button>
					</div>
				</Modal>}
				{showMenu && <div
					className="outer-area"
					onClick={() => setShowMenu(false)}
				></div>}
			</div>
		</div>
	);
}

export default App;
