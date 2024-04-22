import { useState } from 'react';
import '../css/App.css';
import BallRow from './BallRow';

interface Attempt {
	balls: Array<number>;
	hints: Array<number>;
}

const App = () => {
	const [answer, setAnswer] = useState<Array<number>>(makeAnswer());
	const [attempts, setAttempts] = useState<Array<Attempt>>(clearTries());
	const [currentAttempt, setCurrentAttempt] = useState(0);

	function makeAnswer(): Array<number> {
		const numbers = [0, 1, 2, 3, 4, 5];
		const result = [];
		for (let i = 0; i < 4; i++) {
			result.push(numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0]);
		}
		return result;
	}

	function clearTries(): Array<Attempt> {
		const result = [];
		for (let i = 0; i < 10; i++) {
			result.push({
				balls: [-3, -3, -3, -3],
				hints: [-3, -3, -3, -3]
			});
		}
		return result;
	}

	const handleBallClick = (ballIdx: number) => {
		console.log(ballIdx);

	}

	return (
		<div className="App">
			<div className="Codebreaker">
				<header>
					<div className="title">
						<h1>Codebreaker</h1>
						<div></div>
					</div>
					<BallRow
						header
						balls={answer}
					/>
				</header>
				<section className="play-area">
					{attempts.map((attempt, idx) => (
						<BallRow
							key={idx}
							current={currentAttempt === idx}
							balls={attempt.balls}
							hints={attempt.hints}
							onBallClick={handleBallClick}
						/>
					))}
				</section>
			</div>
		</div>
	);
}

export default App;
