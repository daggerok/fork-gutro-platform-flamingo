import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Table,
  Typography,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import { allowAbort, formatDateTimeWithWords } from '~/utils/common';
import { generateReportFromCampaign } from '~/utils/csv-download';
import ConfirmationDialog from '~/components/ConfirmationDialog';
import {
  fetchSchedulingHistoryDetails,
  abortCampaign,
  abortCustomerPromotion,
} from '~/api/scheduling';

import {
  CampaignDetailsProps,
  CampaignDetails as CampaignDetailsType,
  ConfirmAbortDetails,
} from './types';
import tableColumns from './customerpromotiontable-columns';
import styles from './CampaignDetails.module.scss';

const CampaignDetails: React.FC<CampaignDetailsProps> = ({ campaignId, handleClose }: CampaignDetailsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [campaignDetails, setCampaignDetails] = useState<CampaignDetailsType | null>(null);
  const [confirmAbortDetails, setConfirmAbortDetails] = useState<ConfirmAbortDetails | null>(null);

  const loadDetails = (): void => {
    setIsLoading(true);

    fetchSchedulingHistoryDetails(campaignId)
      .then((res) => {
        if (res.data.error) {
          throw new Error(res.data.error);
        }

        setCampaignDetails(res.data.campaign);
        setIsLoading(false);
      })
      .catch(() => {
        setCampaignDetails(null);
        setTimeout(() => {
          // When opening the campaign too quickly after it has been created it's not always found
          // so when that happens we just set a timeout to retry after 5 sec
          loadDetails();
        }, 5000);
      });
  };

  useEffect(() => {
    loadDetails();
  }, [campaignId]);

  const handleAbortCustomerPromotionClick = (customerPromotionId: string): void => {
    setConfirmAbortDetails({
      campaign: false,
      customerPromotionId,
      playerId: campaignDetails?.customerPromotions.find(it => it.customerPromotionId === customerPromotionId)?.playerId,
    });
  };

  const handleAbortCampaignClick = (): void => {
    setConfirmAbortDetails({
      campaign: true,
    });
  };

  const handleGenerateReport = (): void => {
    generateReportFromCampaign(campaignId, campaignDetails);
  };

  const tryAbortCampaign = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await abortCampaign(campaignId);
    } catch (e) { }

    loadDetails();
  };

  const tryAbortCustomerPromotion = async (customerPromotionId: string): Promise<void> => {
    setIsLoading(true);
    try {
      await abortCustomerPromotion(customerPromotionId);
    } catch (e) { }

    loadDetails();
  };

  const handleConfirmAbort = (): void => {
    if (confirmAbortDetails?.campaign) {
      tryAbortCampaign();
    } else if (confirmAbortDetails?.customerPromotionId) {
      tryAbortCustomerPromotion(confirmAbortDetails.customerPromotionId);
    }
    setConfirmAbortDetails(null);
  };

  const handleOverlayClick = (event: React.MouseEvent): void => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const showAbortButton = campaignDetails?.customerPromotions
    && campaignDetails.customerPromotions.some(customerPromotion => allowAbort(customerPromotion.state));

  campaignDetails?.customerPromotions
    .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
    >
      <Card
        title="Campaign details"
        extra={
          <CloseOutlined
            onClick={handleClose}
          />
        }
      >
        <div className={styles.topContainer}>
          <Typography>
            Campaign ID: {campaignId}<br />
            Create date: {campaignDetails?.createDate && formatDateTimeWithWords(new Date(campaignDetails.createDate))}<br />
          </Typography>

          <div>
            <Button
              type="primary"
              ghost
              size="large"
              onClick={handleGenerateReport}
              className={styles.actionButton}
            >
              Generate Report
          </Button>
            {showAbortButton && (
              <Button
                danger
                size="large"
                onClick={handleAbortCampaignClick}
                className={styles.actionButton}
              >
                Abort campaign
              </Button>
            )}

          </div>
        </div>

        <Table
          className={styles.table}
          dataSource={campaignDetails?.customerPromotions}
          rowKey="campaignId"
          columns={tableColumns({
            abortCustomerPromotion: handleAbortCustomerPromotionClick,
          })}
          size="small"
          pagination={false}
          loading={isLoading}
        />
      </Card>

      { confirmAbortDetails && (
        <ConfirmationDialog
          title="Confirm abort"
          subTitle={`Are you sure you want to abort ${confirmAbortDetails.campaign ? 'the whole campaign' : `the promotion for player ${confirmAbortDetails.playerId}`}?`}
          onOkClick={handleConfirmAbort}
          onCancelClick={(): void => setConfirmAbortDetails(null)}
        />
      )}
    </div>
  );
};

export default CampaignDetails;
