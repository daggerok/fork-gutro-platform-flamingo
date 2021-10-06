import React, { useContext } from 'react';
import { Row, Col } from 'antd';

import { Role } from '~/types';
import { hasRole } from '~/utils/role-check';

import Layout from '~/components/Layout';
import { AuthenticationContext } from '~/components/Authentication/AuthenticationContextProvider';

import LandingCard from './LandingCard/';
import styles from './Landing.module.scss';

const Landing: React.FC = () => {

  const { user } = useContext(AuthenticationContext);

  const landingCardItems = [
    {
      title: 'Affiliates',
      description: 'Set up events and urls for affiliate postbacks.',
      page: 'affiliates',
      show: hasRole(Role.AFFILIATE_READ) || hasRole(Role.AFFILIATE_WRITE),
    },
    {
      title: 'Schedule Campaigns',
      description: 'Upload and schedule promotion payouts',
      page: 'csv-upload',
      show: hasRole(Role.PROMOTION_SCHEDULING_READ) || hasRole(Role.PROMOTION_SCHEDULING_WRITE),
    },
  ];

  const permittedLandingCardItems = landingCardItems.filter(card => card.show);

  return (
    <Layout>
      <main className={styles.landing}>
        <Row justify={'center'}>
          <Col span={12}>
            { user?.firstname && 
              <p className={styles.userGreeting}>{ `Hello, ${ user.firstname }!` }</p>
            }
            <h1 className={styles.landingHeader}>Welcome to Flamingo</h1>
            <p className={styles.landingSubtitle}>The #1 tool for configuring affiliate postbacks and scheduling promotions.</p>
          </Col>
        </Row>
        <Row 
          justify={'center'}
          gutter={20}
          className={styles.cardRow}
        >
        { permittedLandingCardItems.map(item =>
          <Col 
            span={5}
            key={item.title}
          >
            <LandingCard 
              key={item.title} 
              title={item.title}
              description={item.description}
              page={item.page}
            />
          </Col>
        )}
        </Row>
      </main>
    </Layout>
  );
};

export default Landing;
