import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, role }) {
  const isLoggedIn = useSelector(state => state.Auth.isLoggedIn);    
  const userRole = useSelector(state => state.Auth.userRole); 

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== role) {
     return <div>Unauthorized</div>
  }
 
  
  return children;
}