import config from './../config';

export const getFullPath = (page: string): string => {
  return (`${config.rootPath}/${page}`);
};