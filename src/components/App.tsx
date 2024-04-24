import { useState } from 'react';
import '../css/App.css';
import BallRow from './BallRow';

interface Attempt {
	balls: Array<number>;
	hints: Array<number>;
}

export type GameStatus = 'run' | 'win' | 'lose';

const MAX_ATTEMPTS = 8;

const App = () => {
	const [answer, setAnswer] = useState<Array<number>>(makeAnswer());
	const [attempts, setAttempts] = useState<Array<Attempt>>(clearAttempts());
	const [currentAttempt, setCurrentAttempt] = useState(0);
	const [gameStatus, setGameStatus] = useState<GameStatus>('run');

	function makeAnswer(): Array<number> {
		const numbers = [0, 1, 2, 3, 4, 5];
		const result = [];
		for (let i = 0; i < 4; i++) {
			result.push(numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0]);
		}
		console.log(result);

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
			console.log('win');
			setGameStatus('win');
		} else if (currentAttempt === MAX_ATTEMPTS - 1) {
			console.log('lose');
			setGameStatus('lose');
		} else {
			console.log('run');
			setCurrentAttempt(currentAttempt + 1);
		}
	}

	const handlePieMenuClick = (ballIdx: number, colorIdx: number) => {
		const attempt = attempts[currentAttempt];
		attempt.balls[ballIdx] = colorIdx;
		const nextAttempts = attempts.map((att, idx) => idx === currentAttempt ? attempt : att);
		setAttempts(nextAttempts);
	}

	return (
		<div className="App">
			<div className="Codebreaker">
				<header>
					<div className="title">
						<h1>Codebreaker</h1>
						<nav></nav>
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
							current={currentAttempt === idx && gameStatus === 'run'}
							balls={attempt.balls}
							hints={attempt.hints}
							gameStatus={gameStatus}
							onEnterClick={handleEnterClick}
							onPieMenuClick={handlePieMenuClick}
						/>
					))}
				</section>
			</div>
		</div>
	);
}

export default App;
