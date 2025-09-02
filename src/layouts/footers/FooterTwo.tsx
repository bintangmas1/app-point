import { Link } from "react-router-dom";

const nav_data = [
	{ id: 1, icon: "house", title: "Beranda", link: "home" },
	{ id: 2, icon: "people", title: "Pelanggan", link: "customer" },
	{ id: 3, icon: "clock-history", title: "Riwayat", link: "logs" },
	{ id: 5, icon: "person", title: "Profil", link: "profile" },
];

const FooterTwo = () => {

	return (
		<>
			<div className="footer-nav-area" id="footerNav">
				<div className="container px-0">
					<div className="footer-nav position-relative">
						<ul className="h-100 d-flex align-items-center justify-content-between ps-0">
							{nav_data.map((item, i) => (
								<li key={i}>
									<Link to={`/${item.link}`}>
										<i className={`bi bi-${item.icon}`}></i>
										<span>{item.title}</span>
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</>
	);
};

export default FooterTwo;
