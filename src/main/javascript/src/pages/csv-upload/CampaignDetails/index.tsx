import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Table,
  Typography,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import axios from 'axios';

import config from '~/config';
import { allowAbort, formatDateTimeWithWords } from '~/utils/common';
import ConfirmationDialog from '~/components/ConfirmationDialog';

import tableColumns from './customerpromotiontable-columns';
import styles from './CampaignDetails.module.scss';


type CampaignDetailsProps = {
  campaignId: string | null;
  handleClose: () => void;
};

type CampaignDetails = {
  campaignId: string;
  createDate: number;
	state: string;
	customerPromotions: Array<CustomerPromotionDetails>;
}

type CustomerPromotionDetails = {
	customerPromotionId: string;
	campaignId: string;
	promotionId: string;
	playerId: string;
	state: string;
	createDate: number;
	updateDate: number;
	scheduleDate: number;
	brand: string;
	currency: string;
	amount: string;
}

type ConfirmAbortDetails = {
  campaign: boolean;
  customerPromotionId?: string;
  playerId?: string;
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({ campaignId, handleClose }: CampaignDetailsProps) => {
  const [ isLoading, setIsLoading ] = useState(true);
  const [ campaignDetails, setCampaignDetails ] = useState<CampaignDetails | null>(null);
  const [ confirmAbortDetails, setConfirmAbortDetails ] = useState<ConfirmAbortDetails | null>(null);

  const loadDetails = (): void => {
    setIsLoading(true);

    axios.get(`${config.apiPath}/campaign-scheduling-history/details/`, {
      params: {
        campaignId,
      },
      timeout: 15000,
    })
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

  const abortCampaign = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await axios.post(
        `${config.apiPath}/campaign-scheduling/abort-campaign/`,
        { campaignId },
        { timeout: 15000 }
      );
    } catch (e) {}

    loadDetails();
  };

  const abortCustomerPromotion = async (customerPromotionId: string): Promise<void> => {
    setIsLoading(true);
    try {
      await axios.post(
        `${config.apiPath}/campaign-scheduling/abort-customer-promotion/`,
        { customerPromotionId },
        { timeout: 15000 }
      );
    } catch (e) {}

    loadDetails();
  };

  const handleConfirmAbort = (): void => {
    if (confirmAbortDetails?.campaign) {
      abortCampaign();
    } else if(confirmAbortDetails?.customerPromotionId) {
      abortCustomerPromotion(confirmAbortDetails.customerPromotionId);
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
            Campaign ID: { campaignId }<br />
            Create date: { campaignDetails?.createDate && formatDateTimeWithWords(new Date(campaignDetails.createDate))}
          </Typography>

          { showAbortButton && (
            <Button
              danger
              size="large"
              onClick={handleAbortCampaignClick}
            >
              Abort campaign
            </Button>
          )}
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
