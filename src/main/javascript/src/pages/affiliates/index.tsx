import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Row, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { Page, ApiError, ApiResult, Role } from '~/types';
import { Affiliate } from '~/components/Affiliate/types';

import { getBrandsWithDetails } from '~/api/brand';
import { getAffiliates } from '~/api/affiliate';

import { AffiliateContext } from '~/components/Affiliate/AffiliateContextProvider';

import Layout from '~/components/Layout';
import PageHeader from '~/components/Layout/PageHeader';

import { getFullPath } from '~/utils/routes';
import { hasRole } from '~/utils/role-check';

import AffiliateList from './AffiliateList';
import AffiliateListFilter from './AffiliateListFilter';

import styles from './Affiliates.module.scss';

const Affiliates: React.FC = () => {

  const [affiliates, setAffiliates] = useState<Array<Affiliate>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    brands, setBrands,
    affiliateSearchParams,
  } = useContext(AffiliateContext);

  const history = useHistory();

  const hasEditRights = hasRole(Role.AFFILIATE_WRITE);

  const handleAddNewAffiliate = (): void => {
    history.push(getFullPath(Page.AffiliateEdit));
  }; 

  const getBrandsFromApi = (): void => {
    getBrandsWithDetails()
      .then((response: ApiResult) => {
        if (response.status === 200) {
          setBrands(response.data);
        }
        if (response.data.error) {
          throw response.data.error;
        }
      })
      .catch((error: ApiError) => {
        message.error(`${error.message}`, 2);
      });
  };

  const getAffiliatesFromApi = (): void => {
    if (loading) { return; }
    setLoading(true);
    getAffiliates(affiliateSearchParams)
      .then((response: ApiResult) => {
        if (!response.data.length) {
          message.info(`No affiliates found`);
        }
        if (response.status === 200) {
          setAffiliates(response.data);
        }
        if (response.data.error) {
          throw response.data.error;
        }
        setLoading(false);
      })
      .catch((error: ApiError) => {
        message.error(`${error.message}`, 2);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!brands.length) { getBrandsFromApi();}
    getAffiliatesFromApi();

  }, []);

  useEffect(() => {
    getAffiliatesFromApi();
  }, [affiliateSearchParams]);


  return (
    <Layout>
      <PageHeader 
        title='Affiliates'
        backgroundHex="#FC8EAC"
      />
      <main className="main">

        <Row className={styles.affiliatesMainRow}>
          <Col span={24}>
            <Button
              className={styles.addNewAffiliateButton}
              type="primary"
              onClick={handleAddNewAffiliate}
              icon={<PlusOutlined />}
              disabled={!hasEditRights}
            >
              Add Affiliate
            </Button>
            <AffiliateListFilter 
              loading={loading}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <AffiliateList 
              affiliates={affiliates} 
              brands={brands}
            />
          </Col>
        </Row>
      </main>
    </Layout>
  );
};

export default Affiliates;



