import { Page } from './../types';
import { getFullPath } from './routes';

export const saveCustomLandingPage = (landingPage: Page): void => {
  localStorage.customLandingPage = '';
  localStorage.customLandingPage = getFullPath(landingPage);      
};

export const getCustomLandingPage = (): string => {
  return localStorage.customLandingPage || getFullPath(Page.Landing);
};