import { useContext } from 'react';
import { Location } from 'history';

import { Page, Role } from '~/types';
import { routes } from '~/routes';
import { getFullPath } from '~/utils/routes';

import { AuthenticationContext } from '~/components/Authentication/AuthenticationContextProvider';

export const hasRole = (role: Role): boolean => {
  const { user } = useContext(AuthenticationContext);
  if (user) {  return (user.roles.includes(role)); }
  
  return false;
};

// add paths that require certain permissions here
export const hasPermission = (location: Location, userRoles: Role[]): boolean => {

  if (location.pathname === getFullPath(Page.Login)) {
    return true;
  }

  if (!userRoles) { return false; }

  const {
    affiliates,
    affiliateedit,
    csvUpload,
  } = routes;

  switch (location.pathname) {
    case getFullPath(Page.AffiliateEdit): return userRoles.some((userRole) => affiliateedit.requiredRole === userRole);
    case getFullPath(Page.Affiliates): return userRoles.some((userRole) => affiliates.requiredRole === userRole);
    case getFullPath(Page.ScheduleCampaigns): return userRoles.some((userRole) => csvUpload.requiredRole === userRole);
    default: return true;
  } 
};
