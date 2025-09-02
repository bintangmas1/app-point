import { Link } from "react-router-dom";

 

const VideoCallingPopup = ({ setIsVideoOpen, isVideoOpen }: any) => {
	return (
		<>
			<div
				className={`video-calling-popup-wrap ${
					isVideoOpen ? "screen-active" : ""
				}`}
				id="videoCallingPopup"
			>
				<div
					className="video-calling-popup-body bg-overlay"
					style={{ backgroundImage: `url(/assets/img/bg-img/2.jpg)` }}
				>
					{/* <!-- User Thumbnail --> */}
					<div className="user-thumbnail mb-3">
						<img src="/assets/img/bg-img/2.jpg" alt="" />
					</div>

					{/* <!-- Video Icon --> */}
					<div className="video-icon d-block mb-1">
						<i className="bi bi-camera-video text-white"></i>
					</div>

					<h6 className="mb-5 text-white">Affan is video calling...</h6>

					{/* <!-- Button Group --> */}
					<div className="button-group">
						<a
							className="btn btn-lg btn-danger rounded-pill me-3"
							id="videoCallDecline"
							href="#"
							onClick={() => setIsVideoOpen(false)}
						>
							Decline
						</a>
						<Link
							className="btn btn-lg btn-success rounded-pill ms-3"
							to="/video-call"
						>
							Accept
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default VideoCallingPopup;
