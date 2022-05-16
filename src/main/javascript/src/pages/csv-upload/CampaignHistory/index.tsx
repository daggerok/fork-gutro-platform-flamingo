import React, { useEffect, useState } from 'react';
import {
  Table,
  Typography,
  DatePicker,
} from 'antd';
import moment from 'moment';

import {
  fetchSchedulingHistory,
} from '~/api/scheduling';

import {
  CampaignHistoryProps,
  RangeValue,
} from './types';

import styles from './CampaignHistory.module.scss';
import tableColumns from './historytable-columns';

const { RangePicker }: any = DatePicker;

const CampaignHistory: React.FC<CampaignHistoryProps> = ({ shouldUpdate, showCampaignDetails }: CampaignHistoryProps) => {
  const [ isLoading, setIsLoading ] = useState(true);
  const [ campaignHistory, setCampaignHistory ] = useState([]);
  const [ startEndDate, setStartEndDate ] = useState({ startDate: moment().startOf('week'), endDate: moment().endOf('week') });

  const loadHistory = (): void => {
    setIsLoading(true);

    const { startDate, endDate } = startEndDate;

    fetchSchedulingHistory(startDate, endDate)
      .then((res) => {
        if (res.data.error) {
          throw new Error(res.data.error);
        }

        setCampaignHistory((res.data.scheduledCampaigns || []).reverse());
      })
      .catch(() => {
        setCampaignHistory([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadHistory();
  }, [startEndDate, shouldUpdate]);

  const handleDatePickerChange = (dates: RangeValue<moment.Moment>): void => {
    const startDate = dates?.[0];
    const endDate = dates?.[1];

    if (startDate && endDate) {
      setStartEndDate({
        startDate,
        endDate,
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <Typography.Title level={3}>Scheduling history</Typography.Title>

        <div>
          <RangePicker
            className={styles.datePicker}
            format="yyyy-MM-DD"
            ranges={{
              'Today': [moment(), moment()],
              'This week': [moment().startOf('week'), moment().endOf('week')],
              'This Month': [moment().startOf('month'), moment().endOf('month')],
            }}
            defaultValue={[startEndDate.startDate, startEndDate.endDate]}
            onChange={handleDatePickerChange}
          />
        </div>
      </div>
      
      <Table
        className={styles.table}
        dataSource={campaignHistory}
        rowKey="campaignId"
        columns={tableColumns({
          showCampaignDetails,
        })}
        size="small"
        pagination={false}
        loading={isLoading}
      />

      <p>
        <b>Note:</b> The promotion will not be handed out to the customers until they login.
      </p>
    </div>
  );
};

export default CampaignHistory;
