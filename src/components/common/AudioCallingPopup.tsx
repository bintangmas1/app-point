 
const AudioCallingPopup = ({ isAudioOpen, setIsAudioOpen }: any) => {
	return (
		<>
			<div
				className={`calling-popup-wrap ${isAudioOpen ? "screen-active" : ""}`}
				id="callingPopup"
			>
				<div className="calling-popup-body bg-primary">
					{/* <!-- User Thumbnail --> */}
					<div className="user-thumbnail mb-3">
						<img src="/assets/img/bg-img/2.jpg" alt="" />
					</div>

					{/* <!-- Call Icon --> */}
					<div className="call-icon d-block mb-2">
						<i className="bi bi-telephone text-white"></i>
					</div>

					<h6 className="mb-5 text-white">Affan is calling...</h6>

					{/* <!-- Button Group --> */}
					<div className="button-group">
						<a
							className="btn btn-lg btn-danger rounded-pill me-2"
							id="callDecline"
							href="#"
							onClick={() => setIsAudioOpen(false)}
						>
							Decline
						</a>
						<a className="btn btn-lg btn-success rounded-pill ms-2" href="#">
							Accept
						</a>
					</div>
				</div>
			</div>
		</>
	);
};

export default AudioCallingPopup;
