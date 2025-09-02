 
import { useTimer } from "react-timer-hook";

const Timer = () => {
	const expiryTimestamp = new Date("2025-12-30");
	const { seconds, minutes, hours, days } = useTimer({ expiryTimestamp });

	return (
		<>
			<div>
				<span className="days">{days}</span>
				<div className="smalltext">Days</div>
			</div>
			<div>
				<span className="hours">{hours}</span>
				<div className="smalltext">Hours</div>
			</div>
			<div>
				<span className="minutes">{minutes}</span>
				<div className="smalltext">Minutes</div>
			</div>
			<div>
				<span className="seconds">{seconds}</span>
				<div className="smalltext">Seconds</div>
			</div>
		</>
	);
};

export default Timer;
