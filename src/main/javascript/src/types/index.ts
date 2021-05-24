export interface Route {
    title: string;
    path: string;
    icon?: React.ComponentClass | React.FunctionComponent;
    component: React.ComponentClass | React.FunctionComponent;
    subRoutes?: Array<Route>;
}

export interface RouteList {
    login: Route;
    csvUpload: Route;
}

export interface TableColumn {
    title: string;
    dataIndex?: string;
    key: string;
    render?: (value: any) => JSX.Element | null; //eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface ApiResult {
    error?: ApiError,
    data?: any
}

interface ApiError {
    message: string;
}
