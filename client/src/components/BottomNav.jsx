import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs } from "./Tabs"; // Ensure you have this Tabs component with tab details

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const handleTabClick = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 w-full flex justify-around items-center bg-white shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] border-t border-gray-200 rounded-t-3xl py-3">
      {Tabs.map((tab, index) => (
        <div
          key={index}
          onClick={() => handleTabClick(tab.path)}
          className={`flex flex-col items-center cursor-pointer ${
            activeTab === tab.path ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <img
            src={activeTab === tab.path ? tab.icon : tab.inActive}
            alt={tab.name}
            className="h-6 w-6 mb-1"
          />
          <span className="text-xs">{tab.name}</span>
        </div>
      ))}
    </div>
  );
};

export default BottomNav;
