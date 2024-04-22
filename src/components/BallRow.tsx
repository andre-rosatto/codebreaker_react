import '../css/BallRow.css';

interface BallRowProps {
	header?: boolean;
	current?: boolean;
	balls: Array<number>;
	hints?: Array<number>;
	onBallClick?: (ballIdx: number) => void;
}

const BallRow = ({ header, current, balls, hints, onBallClick }: BallRowProps) => {
	const getBallClass = (ball: number): string => {
		switch (ball) {
			case -4:
				return 'hidden';
			case -3:
				return 'empty';
			case -2:
				return 'black';
			case -1:
				return 'white';
			default:
				return `color${ball}`;
		}
	}

	return (
		<div className={`BallRow${current ? ' current' : ''}${header ? ' header' : ''}`}>
			<div className="answers">
				{balls?.map((ball, idx) => (
					<div
						key={`ball${idx}`}
						className={`ball ${getBallClass(ball)}`}
						onClick={() => {
							if (typeof onBallClick === 'function') {
								onBallClick(idx)
							}
						}}
					></div>
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
		</div>
	);
}

export default BallRow;