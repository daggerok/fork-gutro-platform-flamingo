import axios from 'axios';

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

const END_OF_RHINO_ERROR = ') ';

axios.interceptors.response.use((response) => response, (error) => {
  const errorData = error?.response?.data;

  if (errorData?.message) {
    const indexOfOccurence = errorData.message.indexOf(END_OF_RHINO_ERROR) + END_OF_RHINO_ERROR.length;
    const trimmedMessage = errorData.message.substr(indexOfOccurence, errorData.message.length);

    errorData.message = `(${errorData?.code} ${errorData?.status}) - ${trimmedMessage}`;
  }

  return Promise.reject(errorData);
});

export default process.env.NODE_ENV === 'production' ? prod : dev;
