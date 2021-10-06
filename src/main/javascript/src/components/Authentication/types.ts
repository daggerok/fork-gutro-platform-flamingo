import { Role } from '~/types';

export type AuthenticationContextProps = {
  user: User | null;
  setUser: (user: User | null) => void;
  authenticated: boolean | null;
  setAuthenticated: (authenticated: boolean | null) => void;
};

export type AuthenticationContextProviderProps = {
  children: React.ReactNode;
}

export type FullpageErrorProps = {
  error: any;
  message?: string; 
};

export type AuthenticationResult = {
  error: string | null;
  authenticated: boolean | null;
}

export type AuthenticationGuardProps = {
  children: React.ReactNode;
};

export type User = {
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  userId: string;
  roles: Role[];
}
