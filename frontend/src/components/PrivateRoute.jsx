import { useSelector } from "react-redux"; 
import { Navigate } from "react-router-dom";
export default function PrivateRoute({ children }) {
  const isLoggedIn = useSelector(state => state.Auth.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}