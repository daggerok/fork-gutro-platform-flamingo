export type AuthenticationContextProps = {
    authenticated: boolean | null;
    setAuthenticated: (authenticated: boolean | null) => void;
};

export type AuthenticationContextProviderProps = {
    children: React.ReactNode;
}

export type FullpageErrorProps = {
    error: string;
};

export type AuthenticationResult = {
    error: string | null;
    authenticated: boolean | null;
}

export type AuthenticationGuardProps = {
    children: React.ReactNode;
};