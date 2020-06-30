import React from 'react';
import { Spin } from 'antd';
import Layout from '~/components/Layout';

import styles from './FullpageSpinner.module.scss';

const FullpageSpinner: React.FC = () => {
  return (
    <Layout>
      <div className={styles.spinnerContainer}>
        <Spin />
      </div>
    </Layout>
  );
};

export default FullpageSpinner;
