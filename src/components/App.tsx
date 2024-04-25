import '../css/App.css';
import { useEffect, useState } from 'react';
import BallRow from './BallRow';
import Modal from './Modal';
import { Language, getLanguageData, getLanguages, shortNameToIdx } from '../localization';

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
	const [gameStatus, setGameStatus] = useState<GameStatus>('play');
	const [showMenu, setShowMenu] = useState(false);
	const [showHowToPlay, setShowHowToPlay] = useState(false);
	const [languageData, setLanguageData] = useState();
	const [currentLanguage, setCurrentLanguage] = useState<Language>(getLanguages()[getStartLanguageIdx()]);

	useEffect(() => {
		if (!currentLanguage) return;
		setLanguageData(getLanguageData(currentLanguage));
		localStorage.setItem('codebreaker', shortNameToIdx(currentLanguage.shortName).toString());

	}, [currentLanguage]);

	function makeAnswer(): Array<number> {
		const numbers = [0, 1, 2, 3, 4, 5];
		const result = [];
		for (let i = 0; i < 4; i++) {
			result.push(numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0]);
		}
		return result;
	}

	function getStartLanguageIdx(): number {
		const data = localStorage.getItem('codebreaker');
		return parseInt(data ?? '0');
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

	// const strToJSX = (str: string): JSX.Element => {
	// 	return <span dangerouslySetInnerHTML={{ __html: str }}></span>
	// }

	return (
		<div className="App">
			<div className="Codebreaker">
				<header>
					<div className="Codebraker__title">
						<h1>Codebreaker</h1>
						<nav onClick={() => setShowMenu(true)}>
							<div className={`menu${showMenu ? '' : ' hidden'}`}>
								<ul>
									{languageData && <li onClick={handleNewGameClick}>{languageData['menuNewGame']}</li>}
									{languageData && <li onClick={handleShowSolutionClick}>{languageData['menuShowSolution']}</li>}
									{languageData && <li onClick={handleHowToPlayClick}>{languageData['menuHowToPlay']}</li>}
									<li className="menu__li-select">
										<ul className="combobox">
											<li className="combobox__current">{currentLanguage?.name}</li>
											{getLanguages().map((language: any) => (
												<li
													key={language.shortName}
													onClick={() => setCurrentLanguage(language)}
												>{language.name}</li>
											))}
										</ul>
									</li>
								</ul>
							</div>
						</nav>
						{showMenu && <div
							className="menu__outer-area"
							onClick={() => setShowMenu(false)}
						></div>}
					</div>
					<BallRow
						header
						balls={answer}
						gameStatus={gameStatus}
					/>
				</header>
				<section className="Codebreaker__play-area">
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
					title={gameStatus === 'win' ? languageData['modalWinTitle'] : languageData['modalLoseTitle']}
				>
					<div className="Modal__content">
						{gameStatus === 'win' && languageData && <p>{languageData['modalWinText']}</p>}
						{gameStatus === 'lose' && languageData && <p>{languageData['modalLoseText']}</p>}
						<button
							className="Modal__button"
							onClick={() => setGameStatus('wait')}
						>OK</button>
					</div>
				</Modal>}
				{showHowToPlay && <Modal title="Como jogar">
					<div className="Modal__content Modal__how-to-play">
						{languageData && languageData['modalHowToPlay']}
						<button
							className="Modal__button"
							onClick={() => setShowHowToPlay(false)}
						>OK</button>
					</div>
				</Modal>}
			</div>
		</div>
	);
}

export default App;
