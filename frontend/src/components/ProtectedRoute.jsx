// ProtectedRoute.js
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/Auth';

const ProtectedRoute = ({ children }) => {

    const { authenticationInfo } = useContext(AuthContext);

  if (!authenticationInfo?.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
