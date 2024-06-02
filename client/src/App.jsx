import axios from "axios";
import { Suspense, lazy, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectRoute from "./auth/ProtectRoute";
import Loaders from "./components/Layout/Loaders";
import { server } from "./constant/config";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth.reducer";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AddProject = lazy(() => import("./pages/AddProject"));
const ProjectListing = lazy(() => import("./pages/ProjectListing"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    axios
      .get(`${server}/user/get-current-user`, { withCredentials: true })
      .then((res) => {
        dispatch(userExists(res.data));
        setLoader(false); // Hide loader when user data is fetched
      })
      .catch(() => {
        dispatch(userNotExists());
        setLoader(false); // Hide loader when user data fetch fails
      });
  }, [dispatch]);

  return loader ? (
    <Loaders />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<Loaders />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectRoute user={user} redirect="/">
                <Dashboard />
              </ProtectRoute>
            }
          />
          <Route
            path="/add-project"
            element={
              <ProtectRoute user={user} redirect="/">
                <AddProject />
              </ProtectRoute>
            }
          />
          <Route
            path="/projects-listing"
            element={
              <ProtectRoute user={user} redirect="/">
                <ProjectListing />
              </ProtectRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;
