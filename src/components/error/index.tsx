import { Link } from "react-router-dom";
import HeaderFour from "../../layouts/headers/HeaderFour";
import FooterTwo from "../../layouts/footers/FooterTwo";
import ScrollTop from "../common/ScrollTop";

 

const Error = () => {
	return (
		<>
		<ScrollTop />
			<HeaderFour links="pages" title="Page Not Found" />

			<div className="page-content-wrapper py-3">
				<div className="custom-container">
					<div className="card">
						<div className="card-body px-5 text-center">
							<img className="mb-4" src="/assets/img/bg-img/39.png" alt="" />
							<h4>
								OOPS... <br /> Page not found!
							</h4>
							<p className="mb-4">
								We couldnt find any results for your search. Try again.
							</p>
							<Link className="btn btn-creative btn-danger" to="/home">
								Go to Home
							</Link>
						</div>
					</div>
				</div>
			</div>

			<FooterTwo />
		</>
	);
};

export default Error;
