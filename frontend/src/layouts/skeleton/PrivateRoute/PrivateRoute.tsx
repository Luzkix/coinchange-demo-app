import { FC, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { Navigate, useLocation } from 'react-router-dom';
import ROUTES from '../../../constants/routes.ts';
import { isTokenValid } from '../../../services/utils/jwtUtils.ts';
import ModalLoaderBlocking from '../../../components/common/ModalLoaderBlocking/ModalLoaderBlocking.tsx';
import { useGeneralContext } from '../../../contexts/GeneralContext.tsx';
import { useTranslation } from 'react-i18next';

// Component is checking and redirecting routes for private layout.
const PrivateRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData, isLoading, logout } = useAuth();
  const location = useLocation();
  const { addErrorPopup } = useGeneralContext();
  const { t } = useTranslation(['errors']);

  //checking token validity for each path change or when accessToken is changed
  useEffect(() => {
    if (userData?.accessToken && !isTokenValid(userData.accessToken)) {
      logout();
      addErrorPopup(t('message.userLoggedOutInvalidToken'));
    }
  }, [location.pathname, userData?.accessToken]);

  //wait until authContext is fully loaded
  if (isLoading) {
    return <ModalLoaderBlocking isOpen />;
  }

  //if not logged in (no userData) -> redirect to login page
  if (!userData) {
    return (
      //note: after login the user is redirected to url he originally entered including search parameters
      <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname + location.search }} replace />
    );
  }
  //if token is invalid -> redirect to login page (which also runs logout() due to useEffect)
  if (!isTokenValid(userData.accessToken)) {
    return (
      <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname + location.search }} replace />
    );
  }

  //else process url as expected
  return children;
};

export default PrivateRoute;
