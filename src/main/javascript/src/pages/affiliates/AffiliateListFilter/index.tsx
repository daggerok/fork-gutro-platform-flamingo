import React, { useState, useContext } from 'react';
import { Row, Col, Input, Select } from 'antd';

import { AffiliateContext } from '~/components/Affiliate/AffiliateContextProvider';

import { AffiliateListFilterProps } from './types';
import styles from './AffiliateListFilter.module.scss';

const { Search } = Input;
const { Option } = Select;

const AffiliateListFilter: React.FC<AffiliateListFilterProps> = ({ 
  loading,
}: AffiliateListFilterProps) => {

  const [status, setStatus] = useState<string>('all'); 

  const {
    affiliateSearchParams, setAffiliateSearchParams,
  } = useContext(AffiliateContext);

  const handleSearchAffiliate = (text: string): void => {
    setAffiliateSearchParams({
      ...affiliateSearchParams,
      text,
      status,
    });
  };

  const handleStatusChange = (affiliateStatus: string): void => {
    setStatus(affiliateStatus);
  };

  return (
    <div className={styles.affiliateFilterContainer}>
      <Row 
        className={styles.affiliateListFilter} 
        justify="start"
      >
        <Col>
          <Select 
            defaultValue="" 
            onChange={handleStatusChange}
            style={{ width: 120 }}
          >
            <Option value="">All</Option>
            <Option 
              color="success" 
              value="enabled"
            >
              Enabled
            </Option>
            <Option 
              color="warning" 
              value="disabled"
            >
              Disabled
            </Option>
          </Select>
        </Col>
        <Col className={styles.affiliateSearchCol}>
          <Search 
            placeholder="Search by id or name" 
            enterButton="Search" 
            allowClear
            onSearch={handleSearchAffiliate}
            loading={loading}
            style={{ width: 400 }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default AffiliateListFilter;
