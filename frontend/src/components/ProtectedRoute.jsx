// ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import localStorageHelper from '../utils/localstorage';

const ProtectedRoute = ({ children }) => {

    const {token} = localStorageHelper.get('account1');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
