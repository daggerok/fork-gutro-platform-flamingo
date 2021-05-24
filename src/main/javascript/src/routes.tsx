
import Login from '~/pages/login';
import CsvUpload from '~/pages/csv-upload';
import { RouteList } from '~/types';

import config from './config';

export const routes: RouteList = {

  login: {
    title: 'Login',
    path: `${config.rootPath}/login`,
    component: Login,
  },

  csvUpload: {
    title: 'CSV Upload',
    path: `${config.rootPath}/csv-upload`,
    component: CsvUpload,
  },
};
