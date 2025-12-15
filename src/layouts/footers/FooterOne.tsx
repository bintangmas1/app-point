const FooterOne = () => {
	return (
		<>
			<div className="preview-footer-area py-4">
				<div className="container demo-container direction-rtl h-100 d-flex align-items-center justify-content-center">
					<div className="text-center my-3">
						<h6 className="">
							<span>{new Date().getFullYear()}</span> &copy; Bintangmas I Tengah Modo
						</h6>
						<p className="">
							Developed by
							<a href="https://www.instagram.com/abdur_rozaq_23" className="fw-bold text-warning" target="_blank">
								AR23</a>
						</p>
					</div>
				</div>
				<div className="pb-5"></div>
			</div>
		</>
	);
};

export default FooterOne;
