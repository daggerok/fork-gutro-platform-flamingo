import React, { useCallback, useState } from 'react';

import Layout from '~/components/Layout';

import CSVUploadForm from './CSVUploadForm';
import CampaignHistory from './CampaignHistory';

import styles from './CsvUpload.module.scss';

const CsvUpload: React.FC = () => {
  const [lastUpload, setLastUpload] = useState<number | null>(null);

  const handleUpload = useCallback(() => {
    setLastUpload(Number(new Date()));
  }, [setLastUpload]);
  
  return (
    <Layout>
      <main className={styles.main}>
        <div className={styles.form}>
          <CSVUploadForm onUpdate={handleUpload} />
        </div>
        <div className={styles.history}>
          <CampaignHistory shouldUpdate={lastUpload} />
        </div>
      </main>
    </Layout>
  );
};

export default CsvUpload;
