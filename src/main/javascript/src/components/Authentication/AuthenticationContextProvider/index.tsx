import React, { createContext, useState } from 'react';
import { User } from '../types';

import {
  AuthenticationContextProps,
  AuthenticationContextProviderProps,
} from '~/components/Authentication/types';

export const AuthenticationContext = createContext<AuthenticationContextProps>({
  user: null,
  setUser: () => { }, // eslint-disable-line @typescript-eslint/no-empty-function
  authenticated: null,
  setAuthenticated: () => { }, // eslint-disable-line @typescript-eslint/no-empty-function
});

const AuthenticationContextProvider: React.FC<AuthenticationContextProviderProps> = ({ children }: AuthenticationContextProviderProps) => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  return (
    <AuthenticationContext.Provider value={{ authenticated, setAuthenticated, user, setUser }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContextProvider;
