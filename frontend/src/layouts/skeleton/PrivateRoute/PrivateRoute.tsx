// Component is checking and redirecting routes for private layout.
import { FC } from 'react';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { Navigate } from 'react-router-dom';
import ROUTES from '../../../constants/routes.ts';
import { isTokenValid } from '../../../services/utils/jwtUtils.ts';
import ModalLoaderBlocking from '../../../components/common/ModalLoaderBlocking/ModalLoaderBlocking.tsx';

const PrivateRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData, isLoading, logout } = useAuth();

  if (isLoading) {
    return <ModalLoaderBlocking isOpen />;
  }

  //if not logged in (no userData) -> redirect to login page
  if (!userData) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
  }
  //if token is invalid -> redirect to login page
  if (!isTokenValid(userData.accessToken)) {
    logout();
    return <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
  }
  //else process url as expected
  return children;
};

export default PrivateRoute;
