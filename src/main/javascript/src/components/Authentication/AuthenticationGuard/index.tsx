import React, { useEffect, useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import idx from 'idx';

import { routes } from '~/routes';
import { fetchIsAuthenticated } from '~/api/auth';
import { AuthenticationGuardProps } from '~/components/Authentication/types';

import { AuthenticationContext } from '../AuthenticationContextProvider';
import FullpageSpinner from './FullpageSpinner';
import FullpageError from './FullpageError';

import { getCustomLandingPage } from '~/utils/local-storage';
import { hasPermission } from '~/utils/role-check';

const LOGIN_PATH = routes.login.path;


const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({ children }: AuthenticationGuardProps) => {
  const [waitingForPotentialRedirect, setWaitingForPotentialRedirect] = useState<boolean>(true);
  const [authenticationStatusError, setAuthenticationStatusError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<boolean>(false);
  
  const { authenticated, setAuthenticated, user, setUser } = useContext(AuthenticationContext);

  const START_PAGE_PATH = getCustomLandingPage();

  const history = useHistory();
  const location = useLocation();

  const goToStart = (): void => { history.replace(START_PAGE_PATH); };
  const goToLogin = (): void => { history.replace(LOGIN_PATH); };

  const triggerRedirectTimeout = (): void => {
    setTimeout(() => {
      setWaitingForPotentialRedirect(false);
    }, 1000);
  };

  const initAuthentication = (): void => {
    fetchIsAuthenticated()
      .then((response) => {
        setUser(idx(response, _ => _.data.user));
        setAuthenticated(idx(response, _ => _.data.authenticated));
        triggerRedirectTimeout();
      })
      .catch((error) => {
        setAuthenticationStatusError(error.messsage);
        setAuthenticated(false);
      });
  };

  useEffect(() => {
    initAuthentication();
  }, []);

  useEffect(() => {
    if (!user && location.pathname === LOGIN_PATH) { 
      setPermissionState(true); 
    } else if (user) {
      const permitted = hasPermission(location, user.roles);
      setPermissionState(permitted); 
    }
  }, [location.pathname]);

  useEffect(() => {
    if (authenticated && location.pathname === LOGIN_PATH) { goToStart(); }
    if (!authenticated && location.pathname !== LOGIN_PATH) { goToLogin(); }

    if (authenticated !== null) {
      triggerRedirectTimeout();
    }
  }, [authenticated]);

  if (authenticationStatusError) {
    return (
      <FullpageError 
        error="500" 
        message={`Authentication service not available. Slack #plat-retention-dev for help. Error: ${authenticationStatusError}`} 
      />
    );
  }

  if (waitingForPotentialRedirect) {
    return <FullpageSpinner />;
  }

  if (!permissionState) {
    return (
      <FullpageError 
        error="403"
        message="You don't have permission to view this page. You are probably missing a required role."
      />
    );
  }

  return <>{children}</>;
};

export default AuthenticationGuard;
