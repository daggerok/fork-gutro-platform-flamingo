import axios from 'axios';
import config from '~/config';

import { ApiResult } from '~/types';

export const loginPlayer = (username: string, password: string): Promise<ApiResult> => {
  return axios.post(`${config.apiPath}/authentication/`, {
    username,
    password,
  }, { timeout: 10000, withCredentials: true });
};

export const logoutPlayer = (): Promise<void> => {
  return axios.delete(`${config.apiPath}/authentication/`, { withCredentials: true });
};

export const fetchIsAuthenticated = (): Promise<ApiResult> => {
  return axios.get(`${config.apiPath}/authentication/`, { timeout: 10000, withCredentials: true });
};
