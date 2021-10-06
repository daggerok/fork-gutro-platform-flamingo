import axios from 'axios';
import { ApiResult } from '~/types';
import config from '~/config';
import { Affiliate, AffiliateApiParams } from '~/components/Affiliate/types';

const baseUrl = `${config.apiPath}/v1/affiliate`;

export const createAffiliate = (affiliate: Affiliate): Promise<ApiResult> => {
  return axios.post(`${baseUrl}/create-affiliate`, {
    ...affiliate,
  }, { timeout: 10000, withCredentials: true });
};

export const updateAffiliate = (affiliate: Affiliate): Promise<ApiResult> => {
  return axios.put(`${baseUrl}/update-affiliate`, {
    ...affiliate,
  }, { timeout: 10000, withCredentials: true });
};

export const deleteAffiliate = (id: string): Promise<ApiResult> => {
  return axios.delete(`${baseUrl}/${id}`, { timeout: 10000, withCredentials: true });
};

export const getAffiliates = (params: AffiliateApiParams): Promise<ApiResult> => {
  return axios.get(`${baseUrl}/`, { params, timeout: 10000, withCredentials: true });
};

export const getAffiliateById = (id: string): Promise<ApiResult> => {
  return axios.get(`${baseUrl}/${id}`, { timeout: 10000, withCredentials: true });
};
