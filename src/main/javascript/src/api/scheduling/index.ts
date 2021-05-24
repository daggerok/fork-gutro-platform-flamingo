import axios from 'axios';

import config from '~/config';
import { ApiResult } from '~/types';

import {
  ScheduledPlayer,
} from '~/utils/csv-upload';

export const fetchSchedulingHistoryDetails = (campaignId: string | null): Promise<ApiResult> => {
  return axios.get(`${config.apiPath}/campaign-scheduling-history/details/`, {
    params: {
      campaignId,
    },
    timeout: 15000,
  });
};

export const fetchSchedulingHistory = (startDate: moment.Moment, endDate: moment.Moment): Promise<ApiResult> => {
  return axios.get(`${config.apiPath}/campaign-scheduling-history/`, {
    params: {
      startDate: startDate.valueOf(),
      endDate: endDate.valueOf(),
    },
    timeout: 15000,
  });
};

export const schedulePromotions = (schedulingPromotions: ScheduledPlayer[] | null): Promise<ApiResult> => {
  return axios.post(`${config.apiPath}/campaign-scheduling/`, {
    schedulingPromotions,
  }, {
    timeout: 60000,
  });
};

export const abortCampaign = async (campaignId: string | null): Promise<void> => {
  await axios.post(
    `${config.apiPath}/campaign-scheduling/abort-campaign/`,
    { campaignId },
    { timeout: 15000 }
  );
};

export const abortCustomerPromotion = async (customerPromotionId: string): Promise<void> => {
  await axios.post(
    `${config.apiPath}/campaign-scheduling/abort-customer-promotion/`,
    { customerPromotionId },
    { timeout: 15000 }
  );
};
