import { Brand } from '~/types';
import { ValidationObject } from '~/types';

export type AffiliateContextProps = {
  affiliateSearchParams: AffiliateApiParams;
  setAffiliateSearchParams: (searchParams: any) => void;
  currentAffiliate: any | null;
  setCurrentAffiliate: (currentAffiliate: any | null) => void;
  affiliateErrors: ValidationObject[] | [];
  setAffiliateErrors: (affiliateErrors: any) => void;
  savedAffiliate: any | null;
  setSavedAffiliate: (savedAffiliate: any | null) => void;
  selectedBrand: Brand | null;
  setSelectedBrand: (selectedBrand: any | null) => void;
  brands: Brand[];
  setBrands: (brands: any | null) => void;
  saved: boolean;
  setSaved: (saved: boolean) => void;
};

export type AffiliateContextProviderProps = {
  children: React.ReactNode;
}

export type Affiliate = {
  affiliateId: string | null;
  affiliateName: string | null;
  createdTimestamp?: string | null;
  updatedTimestamp?: string | null;
  enabled: boolean;
  operatorUIDs: string[];
  postbacks?: AffiliatePostback[];
}

export type AffiliatePostback = {
  id?: number | null;
  name?: string;
  countries?: string[];
  marketingSourceIDs?: string[];
  type: string;
  thresholds?: AffiliateThreshold[];
  url?: string;
}

export type AffiliateThreshold = {
  amount?: number;
  url?: string;
}

export enum AffiliatePostbackType {
  SIGNUP = 'signup',
  DEPOSIT = 'deposit',
  FIRST_DEPOSIT = 'firstDeposit',
  THRESHOLD_DEPOSIT = 'depositThreshold'
}

export interface AffiliateApiParams {
  page?: number;
  size?: number;
  text?: string;
  status?: string;
}
