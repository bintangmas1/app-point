import FooterOne from "../../layouts/footers/FooterOne";
import FooterTwo from "../../layouts/footers/FooterTwo";
import Header from "../../layouts/headers/Header";
import NotificationContainer from "../NotificationContainer";
import ProfileData from "./ProfilData";

const Profile = () => {
  return (
    <>
      <Header />
      <NotificationContainer />
      <div className="page-content-wrapper">
        <ProfileData />
      </div>
      <FooterOne />
      <FooterTwo />
    </>
  );
};

export default Profile;
