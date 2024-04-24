import { useEffect, useState } from 'react';
import '../css/BallRow.css';
import { GameStatus } from './App';

interface BallRowProps {
	header?: boolean;
	current?: boolean;
	balls: Array<number>;
	hints?: Array<number>;
	gameStatus: GameStatus;
	onEnterClick?: () => void;
	onPieMenuClick?: (ballIdx: number, colorIdx: number) => void;
}

const BallRow = ({ header, current, balls, hints, gameStatus, onEnterClick, onPieMenuClick }: BallRowProps) => {
	const [selectedBall, setSelectedBall] = useState<number | null>(null);

	useEffect(() => {
		const handleClickOutside = () => {
			setSelectedBall(null);
		}
		window.addEventListener('click', handleClickOutside)
		return () => window.removeEventListener('click', handleClickOutside);
	});

	const getBallClass = (ball: number): string => {
		if (gameStatus === 'play' && header) return 'hidden';
		switch (ball) {
			case -1: return 'right';
			case -2: return 'misplaced';
			case -3: return 'empty';
			default: return `color${ball}`;
		}
	}

	const handleBallClick = (e: React.MouseEvent, ballIdx: number) => {
		e.stopPropagation();
		setSelectedBall(ballIdx);
	}

	const handlePieMenuClick = (e: React.MouseEvent, ballIdx: number, colorIdx: number) => {
		e.stopPropagation();
		setSelectedBall(-1);
		if (typeof onPieMenuClick === 'function') onPieMenuClick(ballIdx, colorIdx);
	}

	return (
		<div className={`BallRow${current ? ' current' : ''}${header ? ' header' : ''}`}>
			<div className="answers">
				{balls?.map((ball, ballIdx) => (
					<div
						key={`ball${ballIdx}`}
						className={`ball ${getBallClass(ball)}`}
						onClick={e => handleBallClick(e, ballIdx)}
					>
						{/* pie menu */}
						<div
							className={`pie-menu${selectedBall === ballIdx ? '' : ' hidden'}`}
						>
							<div
								className="ball empty"
								onClick={e => handlePieMenuClick(e, ballIdx, -3)}
							></div>
							{(new Array(6)).fill(0).map((_, pieIdx) => (
								<div
									key={pieIdx}
									className={`ball color${pieIdx}${balls.some(ball => ball === pieIdx) ? ' disabled' : ''}`}
									onClick={e => handlePieMenuClick(e, ballIdx, pieIdx)}
								></div>
							))}
						</div>
					</div>
				))}
			</div>
			{hints && <div className="hints">
				{hints.map((hint, idx) => (
					<div
						key={`hint${idx}`}
						className={`hint ${getBallClass(hint)}`}
					></div>
				))}
			</div>}
			{!header && <button
				disabled={balls.some(ball => ball < 0)}
				className={`enter-btn${current ? '' : ' hidden'}`}
				onClick={() => {
					if (typeof onEnterClick === 'function') onEnterClick();
				}}
			></button>}
		</div>
	);
}

export default BallRow;