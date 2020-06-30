import React, { useEffect, useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import idx from 'idx';

import FullpageSpinner from './FullpageSpinner';
import FullpageError from './FullpageError';
import { AuthenticationContext } from '../AuthenticationContextProvider';
import config from '~/config';
import { routes } from '~/routes';

const LOGIN_PATH = routes.login.path;
const START_PAGE_PATH = routes.csvUpload.path;

interface AuthenticationResult {
  error: string | null;
  authenticated: boolean | null;
}

type AuthenticationGuardProps = {
  children: React.ReactNode;
};

const checkAuthenticated = async (): Promise<AuthenticationResult> => {
  return axios.get(`${config.apiPath}/authentication/`, { timeout: 10000, withCredentials: true })
    .then((response) => {
      return {
        authenticated: idx(response, _ => _.data.authenticated) || false,
        error: null,
      };
    })
    .catch((err) => {
      return {
        authenticated: null,
        error: err.message,
      };
    });
};

const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({ children }: AuthenticationGuardProps) => {
  const [ waitingForPotentialRedirect, setWaitingForPotentialRedirect ] = useState<boolean>(true);
  const [ authenticationStatusError, setAuthenticationStatusError ] = useState<string | null>(null);
  const { authenticated, setAuthenticated } = useContext(AuthenticationContext);

  useEffect(() => {
    const fetchAuthenticatedStatus = async (): Promise<void> => {
      const authenticationResult = await checkAuthenticated();
      
      if (authenticationResult.error) {
        setAuthenticationStatusError(authenticationResult.error);
      } else {
        setAuthenticated(authenticationResult.authenticated);
      }
    };
    fetchAuthenticatedStatus();
  }, []);

  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    if (authenticated === true && location.pathname === LOGIN_PATH) {
      history.replace(START_PAGE_PATH);
    }
    if (authenticated === false && location.pathname !== LOGIN_PATH) {
      history.replace(LOGIN_PATH);
    }
    
    if (authenticated !== null ) {
      setTimeout(() => {
        setWaitingForPotentialRedirect(false);
      }, 1000);
    }
  }, [ authenticated ]);

  if (authenticationStatusError) {
    return <FullpageError error={authenticationStatusError} />;
  }

  if (waitingForPotentialRedirect) {
    return <FullpageSpinner />;
  }

  return <>{children}</>;
};

export default AuthenticationGuard;
