import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  console.log("Decoded Token");
  
  
  const token = localStorage.getItem("access-token");
  const decodedToken = jwtDecode(token);
  localStorage.setItem("role", decodedToken['roles']);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;