import axios from 'axios';
import { ApiResult } from '../../types';
import config from '~/config';

export const getBrands = (): Promise<ApiResult> => {
  return axios.get(`${config.apiPath}/brand`, { timeout: 10000, withCredentials: true });
};

export const getBrandsWithDetails = (): Promise<ApiResult> => {
  return axios.get(`${config.apiPath}/brands-with-details`, { timeout: 10000, withCredentials: true });
};
