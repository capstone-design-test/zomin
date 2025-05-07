import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const username = sessionStorage.getItem('username');
  return username ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;