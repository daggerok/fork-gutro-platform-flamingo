import React from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';

import config from '~/config';
import { allowAbort, formatDateTimeWithWords, roundToTwoDecimals } from '~/utils/common';
import { TableColumn } from '~/types';

import { CustomerPromotionTableColumnsProps } from '././types';
import styles from './CampaignDetails.module.scss';

const CustomerPromotionTableColumns = ({ abortCustomerPromotion }: CustomerPromotionTableColumnsProps): TableColumn[] => [
  {
    title: 'Id',
    dataIndex: 'customerPromotionId',
    key: 'customerPromotionId',
  },

  {
    title: 'Promotion ID',
    dataIndex: 'promotionId',
    key: 'promotionId',
    render: function renderPromotionId (promotionId: string): JSX.Element {
      return (
          <span>
            { !promotionId && '-'}
            { promotionId && (
              <a
                key={promotionId}
                href={`${config.antiloopUrl}/#/promotion/${promotionId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {promotionId}
              </a>
            )}
          </span>
      );
    },
  },

  {
    title: 'Player ID',
    dataIndex: 'playerId',
    key: 'playerId',
    render: function renderPlayerId (playerId: string): JSX.Element {
      return (
        <span>
          { playerId && (
            <a
              key={playerId}
              href={`${config.boUrl}/player!view?userId=${playerId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {playerId}
            </a>
          )}
        </span>
      );
    },
  },

  {
    title: 'Status',
    dataIndex: 'state',
    key: 'state',
  },

  {
    title: 'Schedule Date',
    dataIndex: 'scheduleDate',
    key: 'scheduleDate',
    render: function renderScheduleDate (scheduleDate: string): JSX.Element {
      return (
        <span>
          {formatDateTimeWithWords(new Date(scheduleDate))}
        </span>
      );
    },
  },

  {
    title: 'Brand',
    dataIndex: 'brand',
    key: 'brand',
  },

  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
  },

  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: function renderAmount (amount: string): JSX.Element {
      return (
        <span>
          {amount && roundToTwoDecimals(parseFloat(amount))}
        </span>
      );
    },
  },

  {
    title: 'Abort',
    key: 'abort',
    render: function renderAbort (customerPromotion): JSX.Element | null {
      if (!allowAbort(customerPromotion.state)) {
        return null;
      }
      return (
        <div className={styles.centeringContainer}>
          <CloseCircleOutlined
            style={{ color: 'darkred '}}
            onClick={(): void => abortCustomerPromotion(customerPromotion.customerPromotionId)}
          />
        </div>
      );
    },
  },

];

export default CustomerPromotionTableColumns;
