import React from 'react';
import { Card } from 'antd';
import { LandingCardProps } from './types';
import { Link } from 'react-router-dom';
import { getFullPath } from  '~/utils/routes';
import styles from './LandingCard.module.scss';

const LandingCard: React.FC<LandingCardProps> = ({ 
  title, 
  description,
  page,
}: LandingCardProps) => {

  return (
    <Link to={ getFullPath(page) }>
      <Card
        bordered
        hoverable
        className={styles.landingCard}
      >
        <div className={styles.textWrapper}>
          <h2 className={styles.landingCardHeader}>
            { title }
          </h2>
        </div>
        <div className={styles.overlay}>
          <p className={styles.landingCardDescription}> { description }</p>
        </div>
      </Card>
    </Link>
  );

};

export default LandingCard;
