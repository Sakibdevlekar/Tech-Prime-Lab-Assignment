import Header from "../Header";
import SideBar from "../SideBar";
import BottomNav from "../BottomNav";

const AppLayout = (WrappedComponent, heading) => {
  // eslint-disable-next-line react/display-name
  return (props) => (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        {/* Sidebar for larger screens */}
        <div className="flex justify-center items-center w-16 h-full shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] hidden lg:flex">
          <SideBar />
        </div>
        <div className="flex-1 flex flex-col">
          <Header heading={heading} />
          <div className="flex mt-10 flex-1 overflow-y-auto">
            <WrappedComponent {...props} />
          </div>
        </div>
      </div>
      {/* Bottom Navigation for smaller screens */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default AppLayout;
