import Header from "../../layouts/headers/Header";
import FooterTwo from "../../layouts/footers/FooterTwo";
import ScrollTop from "../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import WorkerDataDetail from "./WorkerData";
import NotificationContainer from "../NotificationContainer";

const WorkerDetail = () => {
    return (
        <>
            <ScrollTop />
            <Header />
            <NotificationContainer />
            <div className="page-content-wrapper">
                <WorkerDataDetail />
            </div>
            <FooterOne />
            <FooterTwo />
        </>
    );
};

export default WorkerDetail;
