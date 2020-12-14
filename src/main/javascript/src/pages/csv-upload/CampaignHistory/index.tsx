import React, { useEffect, useState } from 'react';
import {
  Table,
  Typography,
  DatePicker,
} from 'antd';
import axios from 'axios';
import moment from 'moment';

import config from '~/config';

import styles from './CampaignHistory.module.scss';
import tableColumns from './historytable-columns';

type CampaignHistoryProps = {
  shouldUpdate: number | null;
  showCampaignDetails: (id: string) => void;
};

type EventValue<DateType> = DateType | null;
type RangeValue<DateType> = [EventValue<DateType>, EventValue<DateType>] | null;

const CampaignHistory: React.FC<CampaignHistoryProps> = ({ shouldUpdate, showCampaignDetails }: CampaignHistoryProps) => {
  const [ isLoading, setIsLoading ] = useState(true);
  const [ campaignHistory, setCampaignHistory ] = useState([]);
  const [ startEndDate, setStartEndDate ] = useState({ startDate: moment().startOf('week'), endDate: moment().endOf('week') });

  const loadHistory = (): void => {
    setIsLoading(true);

    const { startDate, endDate } = startEndDate;

    axios.get(`${config.apiPath}/campaign-scheduling-history/`, {
      params: {
        startDate: startDate.valueOf(),
        endDate: endDate.valueOf(),
      },
      timeout: 15000,
    })
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
          <DatePicker.RangePicker
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
