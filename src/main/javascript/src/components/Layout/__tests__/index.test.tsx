import React from 'react';
import { act } from '@testing-library/react-hooks';
import { render, screen } from '@testing-library/react';

import Layout from '..';

import { AuthenticationContext } from '~/components/Authentication/AuthenticationContextProvider';

const CONTEXT_PROPS = {
  value: {
    authenticated: false,
    setAuthenticated: (x:any) => x,
    user: {
      email: 'Test',
      username: 'Test',
      firstname: 'Test',
      lastname: 'Test',
      userId: 'Test',
      roles: [],
    },
    setUser: () => { }, // eslint-disable-line @typescript-eslint/no-empty-function
  }
}

const setAuthenticatedContextProp = (authenticated: boolean) => {
  return {
    ...CONTEXT_PROPS,
    value: {
      ...CONTEXT_PROPS.value,
      authenticated
    }
  };
};

describe('<Layout />', () => {

  describe('when authenticated is true', () => {

    it('matches snapshot when authenticated is true', () => {
      act(() => {
        render(
          <AuthenticationContext.Provider {...setAuthenticatedContextProp(true)}>
              <Layout children/>
          </AuthenticationContext.Provider>
        );
      });

      expect(screen.getByTestId('layout-element')).toMatchSnapshot();
    });

    it('renders logout button', () => {
      act(() => {
        render(
          <AuthenticationContext.Provider {...setAuthenticatedContextProp(true)}>
              <Layout children/>
          </AuthenticationContext.Provider>
        );
      });

      expect(screen.getByTestId('logout-button-wrapper')).toBeInTheDocument();
    });

  });

  describe('when authenticated is false', () => {

    it('matches snapshot when authenticated is false', () => {

      act(() => {
        render(
          <AuthenticationContext.Provider {...CONTEXT_PROPS}>
              <Layout children/>
          </AuthenticationContext.Provider>
        );
      });

      expect(screen.getByTestId('layout-element')).toMatchSnapshot();
    });

  });

});