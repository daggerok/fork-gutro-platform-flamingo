import React from 'react';
import { Button } from 'antd';

import Layout from '~/components/Layout';

import styles from './FullpageError.module.scss';

type FullpageErrorProps = {
  error: string;
};

const FullpageError: React.FC<FullpageErrorProps> = ({ error }: FullpageErrorProps) => {
  const handleTryAgainClick = (): void => {
    window.location.reload();
  };

  return (
    <Layout>
      <div className={styles.errorContainer}>
        <span>Error: {error}</span>

        <Button
          onClick={handleTryAgainClick}
          className={styles.tryAgainButton}
        >
          Try again
        </Button>
      </div>
    </Layout>
  );
};

export default FullpageError;
