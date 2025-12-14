import Header from "../../layouts/headers/Header";
import FooterTwo from "../../layouts/footers/FooterTwo";
import ScrollTop from "../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import Menu from "./Menu";
import Search from "./Search";
import Top5 from "./Top5";
import Analytics from "./Analytics";
import RecentActivity from "./RecentActivity";

const Home = () => {
	return (
		<>
			<ScrollTop />
			<Header />
			<div className="page-content-wrapper">
				{/* <Search /> */}
				<Menu />
				<Analytics />
				<Top5 />
				<RecentActivity />
			</div>
			<FooterOne />
			<FooterTwo />
		</>
	);
};

export default Home;
