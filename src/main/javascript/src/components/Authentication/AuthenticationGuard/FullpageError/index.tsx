import React from 'react';
import { Button, Result } from 'antd';

import { Page } from '~/types';
import { getFullPath } from '~/utils/routes';

import Layout from '~/components/Layout';
import { FullpageErrorProps } from '~/components/Authentication/types';

const FullpageError: React.FC<FullpageErrorProps> = ({ 
  error, 
  message = 'Ooops, something went wrong', 
}: FullpageErrorProps) => {

  return (
    <Layout>
      <Result
        status={error}
        title={error}
        subTitle={message}
        extra={
        <Button 
          type="primary" 
          href={getFullPath(Page.Landing)}
        >
          Back Home
        </Button>}
      />
    </Layout>
  );
};

export default FullpageError;
