import React from 'react';

import Layout from '~/components/Layout';

import CSVUploadForm from './CSVUploadForm';

import styles from './CsvUpload.module.scss';

const CsvUpload: React.FC = () => {
  return (
    <Layout>
      <main className={styles.main}>
        <CSVUploadForm />
      </main>
    </Layout>
  );
};

export default CsvUpload;
