import React, { useEffect, useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import idx from 'idx';

import { routes } from '~/routes';
import { fetchIsAuthenticated } from '~/api/auth';
import {
  AuthenticationResult,
  AuthenticationGuardProps,
} from '~/components/Authentication/types';

import { AuthenticationContext } from '../AuthenticationContextProvider';
import FullpageSpinner from './FullpageSpinner';
import FullpageError from './FullpageError';

const LOGIN_PATH = routes.login.path;
const START_PAGE_PATH = routes.csvUpload.path;

const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({ children }: AuthenticationGuardProps) => {
  const [waitingForPotentialRedirect, setWaitingForPotentialRedirect] = useState<boolean>(true);
  const [authenticationStatusError, setAuthenticationStatusError] = useState<string | null>(null);
  const { authenticated, setAuthenticated } = useContext(AuthenticationContext);

  const checkAuthenticated = async (): Promise<AuthenticationResult> => {
    return fetchIsAuthenticated()
      .then((response) => {
        return {
          authenticated: idx(response, _ => _.data.authenticated) || false,
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

    if (authenticated !== null) {
      setTimeout(() => {
        setWaitingForPotentialRedirect(false);
      }, 1000);
    }
  }, [authenticated]);

  if (authenticationStatusError) {
    return <FullpageError error={authenticationStatusError} />;
  }

  if (waitingForPotentialRedirect) {
    return <FullpageSpinner />;
  }

  return <>{children}</>;
};

export default AuthenticationGuard;
