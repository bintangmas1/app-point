import Header from "../../layouts/headers/Header";
import FooterTwo from "../../layouts/footers/FooterTwo";
import ScrollTop from "../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import WorkersData from "./WorkerData";
import NotificationContainer from "../NotificationContainer";

const Workers = () => {
    return (
        <>
            <ScrollTop />
            <Header />
            <NotificationContainer />
            <div className="page-content-wrapper">
                <WorkersData />
            </div>
            <FooterOne />
            <FooterTwo />
        </>
    );
};

export default Workers;
