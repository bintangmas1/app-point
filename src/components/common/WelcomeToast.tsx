 

import { useEffect, useState } from "react";

const WelcomeToast = () => {
	const [show, setShow] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShow(false);
		}, 5000); // 5 seconds

		return () => clearTimeout(timer); // Cleanup the timer on unmount
	}, []);

	return (
		<>
			<div
				className={`toast toast-autohide custom-toast-1 toast-success home-page-toast ${
					show ? "show" : "hide"
				}`}
				role="alert"
				aria-live="assertive"
				aria-atomic="true"
				data-bs-delay="7000"
				data-bs-autohide="true"
			>
				<div className="toast-body">
					<i className="bi bi-bookmark-check text-white h1 mb-0"></i>
					<div className="toast-text ms-3 me-2">
						<p className="mb-1 text-white">Welcome to Affan!</p>
						<small className="d-block">
							Click the <strong>Add to Home Screen</strong> button & enjoy it
							like an app.
						</small>
					</div>
				</div>
				<button
					onClick={() => setShow(false)}
					className="btn btn-close btn-close-white position-absolute p-1"
					type="button"
					data-bs-dismiss="toast"
					aria-label="Close"
				></button>
			</div>
		</>
	);
};

export default WelcomeToast;
