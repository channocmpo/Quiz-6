import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const user_signin_state = useSelector((state) => state.userSignin);
  const { userInfo } = user_signin_state;

  if (!userInfo) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
