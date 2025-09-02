import Header from "../../layouts/headers/Header";
import FooterTwo from "../../layouts/footers/FooterTwo";
import ScrollTop from "../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import CustomerDetailData from "./CustomerData";
import NotificationContainer from "../NotificationContainer";

const CustomerDetail = () => {
    return (
        <>
            <ScrollTop />
            <Header />
            <NotificationContainer />

            <div className="page-content-wrapper">
                <CustomerDetailData />
            </div>
            <FooterOne />
            <FooterTwo />
        </>
    );
};

export default CustomerDetail;
