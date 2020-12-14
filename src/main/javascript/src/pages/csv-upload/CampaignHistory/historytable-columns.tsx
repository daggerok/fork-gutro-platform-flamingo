import React from 'react';

import { formatDateTimeWithWords, getTimeZoneOffset } from '~/utils/common';
import config from '~/config';

import styles from './CampaignHistory.module.scss';

const timeZoneOffset = getTimeZoneOffset();

type HistoryTableColumnsProps = {
  showCampaignDetails: (id: string) => void;
}

type TableColumn = {
  title: string;
  dataIndex: string;
  key: string;
  render: (value: any) => JSX.Element; //eslint-disable-line @typescript-eslint/no-explicit-any
}

const HistoryTableColumns = ({ showCampaignDetails }: HistoryTableColumnsProps): TableColumn[] => [
  {
    title: 'Id',
    dataIndex: 'campaignId',
    key: 'campaignId',
    render: function renderId (id: string): JSX.Element {
      return (
        <a onClick={(): void => { showCampaignDetails(id); }}>{ id }</a>
      );
    },
  },

  {
    title: `Created (GMT${timeZoneOffset})`,
    dataIndex: 'createDate',
    key: 'createDate',
    render: function renderCreateDate (createDate: string): JSX.Element {
      return (
        <span>
          { formatDateTimeWithWords(new Date(createDate)) }
        </span>
      );
    },
  },

  {
    title: 'Promotions',
    dataIndex: 'promotionIds',
    key: 'promotionIds',
    render: function renderPromotionIds (promotionIds: Array<string>): JSX.Element {
      return (
        <span>
          { !promotionIds.length && '-'}
          { promotionIds.map<React.ReactNode>(promotionId => (
            <a
              key={promotionId}
              href={`${config.antiloopUrl}/#/promotion/${promotionId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {promotionId}
            </a>
          )).reduce(
            (prev, curr, index) => prev ? [prev, <span key={index}>,<br /></span>, curr] : [curr],
            null
          )}
        </span>
      );
    },
  },

  {
    title: `Scheduled (GMT${timeZoneOffset})`,
    dataIndex: 'scheduleDates',
    key: 'scheduleDates',
    render: function renderScheduleDates (scheduleDates: Array<string>): JSX.Element {
      return (
        <span className={styles.multiLine}>
          { !scheduleDates.length && '-' }
          { scheduleDates.map(it => formatDateTimeWithWords(new Date(it))).join('\n') }
        </span>
      );
    },
  },

  {
    title: 'Customer Statuses',
    dataIndex: 'customerStatusCount',
    key: 'customerStatusCount',
    render: function renderCustomerStatuses (customerStatusCount: Map<string, string>): JSX.Element {
      return (
        <span className={styles.multiLine}>
          { !Object.keys(customerStatusCount).length && '-' }
          { Object.entries(customerStatusCount || {})
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n')
          }
        </span>
      );
    },
  },
];

export default HistoryTableColumns;