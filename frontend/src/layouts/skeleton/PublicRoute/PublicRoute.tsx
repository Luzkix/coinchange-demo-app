import { FC } from 'react';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { isTokenValid } from '../../../services/utils/jwtUtils.ts';
import { Navigate, useLocation } from 'react-router-dom';
import ROUTES from '../../../constants/routes.ts';
import ModalLoaderBlocking from '../../../components/common/ModalLoaderBlocking/ModalLoaderBlocking.tsx';

// Component is checking and redirecting routes for public layout.
const PublicRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <ModalLoaderBlocking isOpen />;
  }

  // Note: when user starts new app (e.g. after previously closing the browser) he is automatically logged in if there is still valid data (valid token) stored in localStorage
  // == logged-in user cannot display public pages until he logs out

  //if there is valid userData (e.g. loaded from localStorage) -> redirect to portfolio page
  if (userData && isTokenValid(userData.accessToken)) {
    // Redirect to original url (if exists) or to default page (e.g. /portfolio)
    const from = location.state?.from || ROUTES.PORTFOLIO;
    return <Navigate to={from} replace />;
  }
  //else process url as expected
  return children;
};

export default PublicRoute;
