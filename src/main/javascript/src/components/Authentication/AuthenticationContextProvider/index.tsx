import React, { createContext, useState } from 'react';

type AuthenticationContextProps = { 
  authenticated: boolean | null;
  setAuthenticated: (authenticated: boolean | null) => void;
};

export const AuthenticationContext = createContext<AuthenticationContextProps>({
  authenticated: null,
  setAuthenticated: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
});

type AuthenticationContextProviderProps = {
  children: React.ReactNode;
}

const AuthenticationContextProvider: React.FC<AuthenticationContextProviderProps> = ({ children }: AuthenticationContextProviderProps) => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  return (
    <AuthenticationContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContextProvider;
