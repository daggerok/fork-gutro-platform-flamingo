export interface Route {
    title: string;
    path: string;
    icon?: React.ComponentClass | React.FunctionComponent;
    component: React.ComponentClass | React.FunctionComponent;
    subRoutes?: Route[];
    location?: Record<string,unknown>;
    namespace: string;
    requiredRole?: Role;
}

export enum Role {
  AFFILIATE_READ = 'AFFILIATE_READ',
  AFFILIATE_WRITE = 'AFFILIATE_WRITE',
  PROMOTION_SCHEDULING_READ = 'PROMOTION_SCHEDULING_READ',
  PROMOTION_SCHEDULING_WRITE = 'PROMOTION_SCHEDULING_WRITE',
  ADMIN = 'ADMIN',
}

export interface RouteList {
    login: Route;
    csvUpload: Route;
    landing: Route;
    affiliates: Route;
    affiliateedit: Route;
}

export interface TableColumn {
    title: string;
    dataIndex?: string;
    key: string;
    render?: (value: any) => JSX.Element | null; //eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface ApiResult {
    error?: ApiError;
    data?: any;  //eslint-disable-line @typescript-eslint/no-explicit-any
    status?: number;
    statusText?: string;
}

export interface ApiError {
  code?: string;
  status?: string;
  message: string;
}

export interface Validation {
  valid: boolean;
  message?: string;
}

export enum Namespace {
  Affiliate = 'affiliate',
  Campaign = 'campaign',
  General = '',
}

export type Brand = {
  brand: string;
  label: string;
  countries: Country[];
}

export type Country = {
  active: boolean;
  iso: string;
}

export enum Page {
  Affiliates = 'affiliates',
  AffiliateEdit = 'affiliate-edit',
  ScheduleCampaigns = 'csv-upload',
  Landing = 'landing',
  Login = 'login',
}

export type ValidationObject = {
  relatedElement?: string;
  type: ValidationType;
  message: string;
}

export enum ValidationType {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Success = 'success',
}
