// ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import localStorageHelper from '../utils/localstorage';

const ProtectedRoute = ({ children }) => {

  const accounts = localStorageHelper.get('accounts');

  if (!accounts?.account1?.token && !accounts?.account2?.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
