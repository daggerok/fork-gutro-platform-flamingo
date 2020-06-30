const common = {
  apiPath: '/flamingo/api',
};

const prod = {
  ...common,
  rootPath: '/flamingo',
};

const dev = {
  ...common,
  rootPath: '',
};

export default process.env.NODE_ENV === 'production' ? prod : dev;
