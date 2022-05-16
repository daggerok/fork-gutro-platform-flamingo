/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useState } from 'react';

import {
  AffiliateContextProps,
  AffiliateContextProviderProps,
} from '~/components/Affiliate/types';

const initialAffiliateParams = {
  page: 1,
  size: 25,
  text: '',
  status: 'all',
};

export const AffiliateContext = createContext<AffiliateContextProps>({
  affiliateSearchParams: initialAffiliateParams,
  setAffiliateSearchParams: () => {},
  currentAffiliate: null,
  setCurrentAffiliate: () => {},
  affiliateErrors: [],
  setAffiliateErrors: () => {},
  savedAffiliate: null,
  setSavedAffiliate: () => {},
  selectedBrands: [],
  setSelectedBrands: () => [],
  brands: [],
  setBrands: () => {},
  saved: true,
  setSaved: () => {},
});

const AffiliateContextProvider: React.FC<AffiliateContextProviderProps> = ({ children }: AffiliateContextProviderProps) => {
  const [affiliateSearchParams, setAffiliateSearchParams] = useState(initialAffiliateParams);
  const [currentAffiliate, setCurrentAffiliate] = useState(null);
  const [affiliateErrors, setAffiliateErrors] = useState([]);
  const [savedAffiliate, setSavedAffiliate] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brands, setBrands] = useState([]);
  const [saved, setSaved] = useState(true);

  return (
    <AffiliateContext.Provider 
      value={{ 
        affiliateSearchParams,
        setAffiliateSearchParams,
        currentAffiliate,
        setCurrentAffiliate,
        affiliateErrors,
        setAffiliateErrors,
        savedAffiliate,
        setSavedAffiliate,
        selectedBrands,
        setSelectedBrands,
        brands,
        setBrands,
        saved,
        setSaved,
      }}
    >
      {children}
    </AffiliateContext.Provider>
  );
};

export default AffiliateContextProvider;
