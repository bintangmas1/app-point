import React from "react";

const TemplatesOffcanvas = ({ show, handleToggle }: any) => {
	return (
		<>
			<div
				className={`offcanvas offcanvas-start ${show ? "show" : ""}`}
				data-bs-scroll="true"
				tabIndex={-1}
				id="othersTemplate"
				aria-labelledby="othersTemplateLabel"
			>
				<div className="offcanvas-header">
					<button
						onClick={handleToggle}
						type="button"
						className="btn-close"
						data-bs-dismiss="offcanvas"
						aria-label="Close"
					></button>
				</div>

				<div className="offcanvas-body"> 
					
					<div className="others-items-preview shadow-sm mb-3">
						<div className="alert alert-info mb-0" role="alert">
							<img
								className="mb-2"
								src="/assets/img/demo-img/suha.png"
								alt=""
							/>
							{/* <h6>Suha - PWA Ecommerce Mobile</h6> */}
							<h6>Suha - PWA Mobile React Next js Template</h6>
							<a
								className="btn btn-success btn-sm w-100 rounded-pill"
								target="_blank"
								href="https://themeforest.net/item/suha-pwa-ecommerce-mobile/52838653?s_rank=11"
							>
								View Demo <i className="ms-1 bi bi-box-arrow-up-right"></i>
							</a>
						</div>
					</div>
					<div className="others-items-preview shadow-sm mb-3">
						<div className="alert alert-info mb-0" role="alert">
							<img
								className="mb-2"
								src="/assets/img/demo-img/affan.png"
								alt=""
							/>
							<h6>Affan - PWA Mobile React Next js Template</h6>
							<a
								className="btn btn-success btn-sm w-100 rounded-pill"
								target="_blank"
								href="https://themeforest.net/item/affan-pwa-mobile-react-next-jstemplate/53297306?s_rank=9"
							>
								View Demo <i className="ms-1 bi bi-box-arrow-up-right"></i>
							</a>
						</div>
					</div>
					<div className="others-items-preview shadow-sm mb-3">
						<div className="alert alert-info mb-0" role="alert">
							<img
								className="mb-2"
								src="/assets/img/demo-img/travgo.jpg"
								alt=""
							/>
							<h6>Travgo - Travel Mobile App React Next js Template</h6>
							<a
								className="btn btn-success btn-sm w-100 rounded-pill"
								target="_blank"
								href="https://themeforest.net/item/travgo-travel-mobile-app-react-template/51552555?s_rank=13"
							>
								View Demo <i className="ms-1 bi bi-box-arrow-up-right"></i>
							</a>
						</div>
					</div>
 
					<div className="others-items-preview shadow-sm mb-3">
						<div className="alert alert-info mb-0" role="alert">
							<img
								className="mb-2"
								src="/assets/img/demo-img/vixan.jpg"
								alt=""
							/>
							<h6>Vixan - Digital Creative Agency Next js Template</h6>
							<a
								className="btn btn-success btn-sm w-100 rounded-pill"
								target="_blank"
								href="https://themeforest.net/item/vixan-digital-creative-agency-next-jstemplate/51049060?s_rank=15"
							>
								View Demo <i className="ms-1 bi bi-box-arrow-up-right"></i>
							</a>
						</div>
					</div>					 
					 
				</div>
			</div>
		</>
	);
};

export default TemplatesOffcanvas;
