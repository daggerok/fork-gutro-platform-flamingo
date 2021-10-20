import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

import { Page } from '~/types'; 
import { AffiliatePostback, Affiliate } from '~/components/Affiliate/types';

import { getFullPath } from '~/utils/routes';
import { convertDateToString, sortBy } from '~/utils/common';
import { saveCustomLandingPage } from '~/utils/local-storage';
import { AffiliateContext } from '~/components/Affiliate/AffiliateContextProvider';

import { AffiliateListProps } from './types';
import styles from './AffiliateList.module.scss';


const AffiliateList: React.FC<AffiliateListProps> = ({ 
  affiliates,
  brands = [],
}: AffiliateListProps) => {

  const {
    affiliateSearchParams, setAffiliateSearchParams,
  } = useContext(AffiliateContext);

  const history = useHistory();

  useEffect(() => {
    saveCustomLandingPage(Page.Affiliates);
  }, []);

  const dateElement = (dateString: string): JSX.Element => {
    const timestamp = Date.parse(dateString);

    return (<span>{ convertDateToString(timestamp) }</span>);
  };

  const onClickRow = (record: any): any => {
    return {
      onClick: (): void => {
        history.push(`${getFullPath(Page.AffiliateEdit)}/${record.affiliateId}`);
      },
    };
  };

  const getTagColor = (type: string): string => {
    switch (type) {
      case 'signup':
        return '#E361D8';
      case 'deposit': 
        return '#BE94F0';
      case 'firstDeposit': 
        return '#F76A90';
      default: return '#FF9B6E';
    }
  };

  const columns = [
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      key: 'enabled',
      // eslint-disable-next-line react/display-name
      render: (enabled: boolean): JSX.Element => {
        const icon = enabled ? <CheckCircleOutlined style={{color: '#3CD79C', fontSize: '2em'}} /> : <CloseCircleOutlined style={{color: '#F34473', fontSize: '2em'}} />;
        return (icon);
      },
      sorter: (a: Affiliate, b: Affiliate): number => Number(a.enabled) - Number(b.enabled),
    },
    {
      title: 'ID',
      dataIndex: 'affiliateId',
      key: 'affiliateId',
      sorter: (a: Affiliate, b: Affiliate): number => sortBy(a.affiliateId, b.affiliateId),
    },
    {
      title: 'Name',
      dataIndex: 'affiliateName',
      key: 'affiliateName',
    },
    {
      title: 'Postbacks',
      dataIndex: 'postbacks',
      key: 'postbacks',
      // eslint-disable-next-line react/display-name
      render: (postbacks: Array<AffiliatePostback>): JSX.Element => (
        <>
          {
            [...new Set(postbacks.map(postback => postback.type))].map((type: string, index: number) => {
              return(
                <Tag 
                  key={index} 
                  color={getTagColor(type)}
                >
                  {type}
                </Tag>
              );
            })
          }
        </>
      ),
    },
    {
      title: 'Operator ID',
      dataIndex: 'operatorUIDs',
      key: 'operatorUIDs',
      // eslint-disable-next-line react/display-name
      render: (operatorUIDs: string[]): JSX.Element => (
        <>
          { operatorUIDs?.map((operatorUid: string, index): JSX.Element => {
            let operatorLabel;
            brands?.map((brand)=>{
              if (brand.brand === operatorUid) {
                operatorLabel = brand.label;
              }
            });
            return (
              <span key={ index }>{ operatorLabel }</span>
            );
          })}
        </>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdTimestamp',
      key: 'createdTimestamp',
      // eslint-disable-next-line react/display-name
      render: (createdTimestamp: string): JSX.Element => {
        return dateElement(createdTimestamp);
      },
      sorter: (a: Affiliate, b: Affiliate): number  => sortBy(a.createdTimestamp, b.createdTimestamp),
    },
    {
      title: 'Updated',
      dataIndex: 'updatedTimestamp',
      key: 'updatedTimestamp',
      // eslint-disable-next-line react/display-name
      render: (updatedTimestamp: string): JSX.Element => {
        if (!updatedTimestamp) { return <span>-</span>; }
        return dateElement(updatedTimestamp);
      },
      sorter: (a: Affiliate, b: Affiliate): number  => sortBy(a.updatedTimestamp, b.updatedTimestamp),
    },
  ];

  const handleChange = ({ current, pageSize }: any): void => {
    setAffiliateSearchParams({
      ...affiliateSearchParams,
      ...{
        page: current,
        size: pageSize,
      },
    });
  };

  return (
    <Table 
      className={styles.affiliateListTable}
      dataSource={affiliates} 
      columns={columns} 
      onRow={onClickRow}
      rowKey='affiliateId'
      pagination={{ defaultPageSize: 25, showSizeChanger: true, pageSizeOptions: ['25', '50', '75']}}
      onChange={handleChange}
    />
  );

};

export default AffiliateList;