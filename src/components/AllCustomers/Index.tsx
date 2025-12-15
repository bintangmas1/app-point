import Header from "../../layouts/headers/Header";
import FooterTwo from "../../layouts/footers/FooterTwo";
import ScrollTop from "../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import CustomersData from "./CustomersData";
import NotificationContainer from "../NotificationContainer";

const AllCustomers = () => {
    return (
        <>
            <ScrollTop />
            <Header />
            <NotificationContainer />
            <div className="page-content-wrapper">
                <CustomersData />
            </div>
            <FooterOne />
            <FooterTwo />
        </>
    );
};

export default AllCustomers;
