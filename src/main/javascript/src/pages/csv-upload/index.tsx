import React, { useCallback, useState } from 'react';
import { Row, Col, Alert } from 'antd';
import { saveCustomLandingPage } from '~/utils/local-storage';
import { hasRole } from '~/utils/role-check';
import { Page, Role } from '~/types'; 
import Layout from '~/components/Layout';
import PageHeader from '~/components/Layout/PageHeader';


import CSVUploadForm from './CSVUploadForm';
import CampaignHistory from './CampaignHistory';
import CampaignDetails from './CampaignDetails';

const CsvUpload: React.FC = () => {
  const [refreshHistory, setRefreshHistory] = useState<number | null>(null);
  const [showingDetailsForCampaignId, setShowingDetailsForCampaignId] = useState<string | null>(null);

  const hasEditRights = hasRole(Role.PROMOTION_SCHEDULING_WRITE);

  saveCustomLandingPage(Page.ScheduleCampaigns);

  const doRefreshHistory = useCallback(() => {
    setRefreshHistory(Number(new Date()));
  }, [setRefreshHistory]);

  const handleCampaignDetailsClose = (): void => {
    setShowingDetailsForCampaignId(null);
    doRefreshHistory();
  };

  return (

    <Layout>
      <PageHeader 
        title="Schedule Promotions"
        subtitle="Upload csv to schedule promotion payouts"
        backgroundHex="#3CD79C"
      />
      { !hasEditRights && 
        <Alert 
          showIcon
          type="info" 
          message="READ ONLY" 
        />
      }
      <main className="main">
        <Row>
          <Col span={16} >
            <CampaignHistory
              shouldUpdate={refreshHistory}
              showCampaignDetails={setShowingDetailsForCampaignId}
            />
          </Col>
          <Col 
            span={6}
            offset={2}
          >
            <CSVUploadForm onUpdate={doRefreshHistory} />
          </Col>
        </Row>
        {showingDetailsForCampaignId && (
          <Row>
            <Col span={12}>
              <CampaignDetails
                campaignId={showingDetailsForCampaignId}
                handleClose={handleCampaignDetailsClose}
              />
            </Col>
          </Row>
        )}
      </main>
    </Layout>
  );
};

export default CsvUpload;
