/* eslint-disable react/prop-types */
import axios from "axios";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import headerImage from "../assets/Header-bg.svg";
import backArrow from "../assets/back arrow.svg";
import Logo from "../assets/Logo.svg";
import Logout from "../assets/Logout-white.svg";
import { server } from "../constant/config";
import { userExists, userNotExists } from "../redux/reducers/auth.reducer";

const Header = ({ heading }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handelBackButton = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    console.log("Logout function triggered");
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          dispatch(userExists(false));
          navigate("/login"); // Redirect to login page after logout
        } else {
          throw new Error("Logout failed"); // Handle logout failure
        }
      })
      .catch((error) => {
        dispatch(userNotExists());
        console.error("Logout error:", error); // Log the error for debugging
      });
  };

  return (
    <div className="relative w-full">
      <img src={headerImage} alt="header" className="w-full object-cover" />
      <div className="absolute inset-x-0 top-3 z-10 pl-5 flex gap-5 items-center text-center">
        {location.pathname === "/add-project" && (
          <img
            className="h-4 font-bold text-white text-start lg:h-6"
            src={backArrow}
            alt="back-arrow"
            onClick={handelBackButton}
          />
        )}
        <h1 className="text-md font-semibold text-white text-start lg:text-left lg:text-4xl">
          {heading}
        </h1>
      </div>
      <div className="absolute inset-x-0 flex items-center justify-center md:top-4 xl:top-8">
        <div className="z-10">
          <img src={Logo} className="hidden lg:block" alt="logo" />
        </div>
      </div>
      <div
        onClick={handleLogout}
        className="absolute top-4 right-5 p-2  flex items-center cursor-pointer text-white lg:hidden"
      >
        <img src={Logout} alt="Logout" className=" h-6 w-6 text-white" />
      </div>
    </div>
  );
};

export default Header;
