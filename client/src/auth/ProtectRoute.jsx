import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function ProtectRoute({ user, children, redirect = "/" }) {
  if (!user) return <Navigate to={redirect} />;
  return children;
}

export default ProtectRoute;
