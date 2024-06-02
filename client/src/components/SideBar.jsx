import { useEffect, useState } from "react";
import { Tabs } from "./Tabs";
import Logout from "../assets/Logout.svg";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../constant/config";
import { userExists, userNotExists } from "../redux/reducers/auth.reducer";
import { useDispatch } from "react-redux"; // Removed useSelector as it's not used

const SideBar = () => {
  const location = useLocation();
useEffect(()=>{
  setActiveTab(location.pathname)
},[location.pathname])
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          dispatch(userExists(false));
          setLoader(false); // Hide loader when user data is fetched
          navigate("/login"); // Redirect to login page after logout
        } else {
          throw new Error("Logout failed"); // Handle logout failure
        }
      })
      .catch((error) => {
        dispatch(userNotExists());
        setLoader(false); // Hide loader when user data fetch fails
        console.error("Logout error:", error); // Log the error for debugging
      });
  };

  const handleTabClick = (path) => {
    setActiveTab((prevTab) => (prevTab === path ? null : path)); // Toggle active state
    navigate(path);
  };

  return (
    <div className="w-16 h-full flex flex-col items-center justify-center space-y-10 py-4 relative">
      {Tabs.map((tab, index) => (
        <div
          key={index}

          onClick={() => handleTabClick(tab.path)}
        >
          <div className="flex-shrink-0">
            <img src={activeTab === tab.path ? tab.icon : tab.inActive} alt={tab.name} />
          </div>
        </div>
      ))}
      <div className="absolute bottom-10 space-x-2" onClick={handleLogout}>
        <div className="flex-shrink-0">
          <img src={Logout} alt="Logout" />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
