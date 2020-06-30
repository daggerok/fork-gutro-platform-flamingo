import React from 'react';

import config from './config';

import Login from '~/pages/login';
import CsvUpload from '~/pages/csv-upload';

export interface Route {
  title: string;
  path: string;
  icon?: React.ComponentClass | React.FunctionComponent;
  component: React.ComponentClass | React.FunctionComponent;
  subRoutes?: Array<Route>;
}

export interface RouteList {
  login: Route;
  csvUpload: Route;
}

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
