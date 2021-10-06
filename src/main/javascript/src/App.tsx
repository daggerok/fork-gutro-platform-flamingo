import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AuthenticationContextProvider from '~/components/Authentication/AuthenticationContextProvider';
import AuthenticationGuard from '~/components/Authentication/AuthenticationGuard';
import AffiliateContextProvider from '~/components/Affiliate/AffiliateContextProvider';

import { routes } from './routes';

const App: React.FC = () => {

  return (
    <BrowserRouter>

      <AuthenticationContextProvider>
        <AuthenticationGuard>
          <AffiliateContextProvider>
            <Switch>
            { Object.values(routes).map((route) => (
              <Route
                key={route.path}
                path={route.path}
                component={route.component}
              />
            ))}
            </Switch>
          </AffiliateContextProvider>
        </AuthenticationGuard>
      </AuthenticationContextProvider>
      
    </BrowserRouter>
  );
};

export default App;
