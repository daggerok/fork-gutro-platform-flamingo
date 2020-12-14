const common = {
  apiPath: '/flamingo/api',
  antiloopUrl: `${location.origin}/antiloop`,
  boUrl: `${location.origin}/bo`,
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
