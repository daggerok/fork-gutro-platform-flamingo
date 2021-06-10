import React, { useEffect, useState } from 'react';
import { ApiResult } from '../../../types';
import { fetchEnvironment } from '../../../api/environment';
import { Environments } from './types';
import Flag from './../Flag';

const EnvironmentFlag: React.FC = () => {
  const [environment, setEnvironment] = useState<string>('');
  const [country, setCountry] = useState<string>('');

  const FLAG_MAP: Environments = {
    italy: 'IT',
    spain: 'ES',
    malta: 'MT',
    dev: '',
  };

  useEffect(() => {
    if (!environment) { return; }
    setCountry(FLAG_MAP[environment as keyof Environments]);
  }, [environment]);

  const getEnvironment = async (): Promise<ApiResult> => {
    return fetchEnvironment()
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new Error(error); 
      });
  };

  useEffect(() => {
    const initEnvironment = async (): Promise<void> => {
      const { data } = await getEnvironment();
      setEnvironment(data.environment);
    };
    initEnvironment().catch(e => console.error(e));
  }, []);

  return (
    <Flag 
      country={country}  
    />
  );
};

export default EnvironmentFlag;
