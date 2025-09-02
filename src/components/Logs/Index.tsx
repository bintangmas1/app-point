import Header from "../../layouts/headers/Header";
import FooterTwo from "../../layouts/footers/FooterTwo";
import ScrollTop from "../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import LogsData from "./LogsData";
import NotificationContainer from "../NotificationContainer";

const Logs = () => {
    return (
        <>
            <ScrollTop />
            <Header />
            <NotificationContainer />
            <div className="page-content-wrapper">
                <LogsData />
            </div>
            <FooterOne />
            <FooterTwo />
        </>
    );
};

export default Logs;
