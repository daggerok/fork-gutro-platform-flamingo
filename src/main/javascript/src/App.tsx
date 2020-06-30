import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import AuthenticationContextProvider from '~/components/Authentication/AuthenticationContextProvider';
import AuthenticationGuard from '~/components/Authentication/AuthenticationGuard';

import { routes } from './routes';

const App: React.FC = () => {
  return (
    <BrowserRouter>

      <AuthenticationContextProvider>
        <AuthenticationGuard>

          { Object.values(routes).map((route) => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.path === '/'}
              component={route.component}
            />
          ))}

        </AuthenticationGuard>
      </AuthenticationContextProvider>
      
    </BrowserRouter>
  );
};

export default App;
