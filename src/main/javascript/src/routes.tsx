
import Login from '~/pages/login';
import Landing from '~/pages/landing';
import CsvUpload from '~/pages/csv-upload';
import AffiliateList from '~/pages/affiliates';
import AffiliateEdit from '~/pages/affiliate-edit';

import { 
  Namespace, 
  RouteList, 
  Page, 
  Role,
} from '~/types';

import { getFullPath } from  '~/utils/routes';

export const routes: RouteList = {

  login: {
    title: 'Login',
    path: getFullPath(Page.Login),
    component: Login,
    namespace: Namespace.General,
  },

  landing: {
    title: 'Landing',
    path: getFullPath(Page.Landing),
    component: Landing,
    namespace: Namespace.General,
  },

  csvUpload: {
    title: 'CSV Upload',
    path: getFullPath(Page.ScheduleCampaigns),
    component: CsvUpload,
    namespace: Namespace.Campaign,
    requiredRole: Role.PROMOTION_SCHEDULING_READ,
  },

  affiliates: {
    title: 'Affiliates',
    path: getFullPath(Page.Affiliates),
    component: AffiliateList,
    namespace: Namespace.Affiliate,
    requiredRole: Role.AFFILIATE_READ,
  },

  affiliateedit: {
    title: 'Edit Affiliate',
    path: `${getFullPath(Page.AffiliateEdit)}/:id?`,
    component: AffiliateEdit,
    namespace: Namespace.Affiliate,
    requiredRole: Role.AFFILIATE_READ,
  },
};
