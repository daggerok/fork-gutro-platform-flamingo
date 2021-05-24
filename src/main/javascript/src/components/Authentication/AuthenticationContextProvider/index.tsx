import React, { createContext, useState } from 'react';

import {
  AuthenticationContextProps,
  AuthenticationContextProviderProps,
} from '~/components/Authentication/types';

export const AuthenticationContext = createContext<AuthenticationContextProps>({
  authenticated: null,
  setAuthenticated: () => { }, // eslint-disable-line @typescript-eslint/no-empty-function
});

const AuthenticationContextProvider: React.FC<AuthenticationContextProviderProps> = ({ children }: AuthenticationContextProviderProps) => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  return (
    <AuthenticationContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContextProvider;
