import React, { useCallback, useState } from 'react';

import Layout from '~/components/Layout';

import CSVUploadForm from './CSVUploadForm';
import CampaignHistory from './CampaignHistory';
import CampaignDetails from './CampaignDetails';

import styles from './CsvUpload.module.scss';

const CsvUpload: React.FC = () => {
  const [refreshHistory, setRefreshHistory] = useState<number | null>(null);
  const [ showingDetailsForCampaignId, setShowingDetailsForCampaignId ] = useState<string | null>(null);

  const doRefreshHistory = useCallback(() => {
    setRefreshHistory(Number(new Date()));
  }, [setRefreshHistory]);

  const handleCampaignDetailsClose = (): void => {
    setShowingDetailsForCampaignId(null);
    doRefreshHistory();
  };
  
  return (
    <Layout>
      <main className={styles.main}>
        <div className={styles.form}>
          <CSVUploadForm onUpdate={doRefreshHistory} />
        </div>
        <div className={styles.history}>
          <CampaignHistory
            shouldUpdate={refreshHistory}
            showCampaignDetails={setShowingDetailsForCampaignId}
          />
        </div>

        { showingDetailsForCampaignId && (
            <CampaignDetails
              campaignId={showingDetailsForCampaignId}
              handleClose={handleCampaignDetailsClose}
            />
        )}
      </main>
    </Layout>
  );
};

export default CsvUpload;
