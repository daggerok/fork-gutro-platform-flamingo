import axios from 'axios';

import { ApiResult } from './../../types';

export const fetchEnvironment = (): Promise<ApiResult> => {
  return axios.get(`/flamingo/api/environment/`, { timeout: 10000, withCredentials: true });
};
