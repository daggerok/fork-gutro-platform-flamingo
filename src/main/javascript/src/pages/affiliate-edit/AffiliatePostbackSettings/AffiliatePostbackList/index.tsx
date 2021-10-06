import React from 'react';

import { Table, Tag } from 'antd';

import Flag from './../../../../components/Common/Flag';

import { AffiliatePostbackListProps } from './types';
import { AffiliateThreshold, AffiliatePostback } from '../../../../components/Affiliate/types';

import styles from './AffiliatePostbackList.module.scss';

const AffiliatePostbackList: React.FC<AffiliatePostbackListProps> = ({ 
  postbacks = [],
}: AffiliatePostbackListProps) => {

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      // eslint-disable-next-line
      sorter: (a: AffiliatePostback, b: AffiliatePostback): any => a.type.localeCompare(b.type),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Enabled Countries',
      dataIndex: 'countries',
      key: 'countries',
      // eslint-disable-next-line react/display-name
      render: (countries: Array<string>): JSX.Element => (
        <>
        { countries &&
          countries.map((country: string): JSX.Element => {
            return (
              <span                 
                key={country}
                className={styles.flagContainer}
              >
                <Flag country={country}/>
              </span>
            );
          })}
        { (!countries || !countries.length) && <Tag color="#F34473">ALL</Tag> }
        </>
      ),
    },
    {
      title: 'Market Sources',
      dataIndex: 'marketingSourceIDs',
      key: 'marketingSourceIDs',
      // eslint-disable-next-line react/display-name
      render: (marketingSourceIDs: Array<string>): JSX.Element => (
        <>
        { marketingSourceIDs && marketingSourceIDs.map((marketSource: string): JSX.Element => {
          if (marketSource.length) {
            return (
              <Tag 
                key={marketSource} 
                color="#F34473"
              >
                {marketSource}
              </Tag>
            );
          } else { 
            return(<span><em>None</em></span>); 
          }
        })}
        </>
      ),
    },
    {
      title: 'Thresholds',
      dataIndex: 'thresholds',
      key: 'thresholds',
      // eslint-disable-next-line react/display-name
      render: (thresholds: AffiliateThreshold[]): JSX.Element => (
        <>
        { thresholds &&
          thresholds.map((threshold: AffiliateThreshold, index): JSX.Element => {
            return (
              <Tag 
                key={index} 
                color="#3CD79C"
              >
                €{threshold.amount}
              </Tag>
            );
          })}
          { (!thresholds || !thresholds.length) && <span><em>Not applicable</em></span>}
        </>
      ),
    },
  ];

  return (
    <Table 
      dataSource={postbacks} 
      columns={columns} 
      rowKey='id' 
    />
  );

};

export default AffiliatePostbackList;