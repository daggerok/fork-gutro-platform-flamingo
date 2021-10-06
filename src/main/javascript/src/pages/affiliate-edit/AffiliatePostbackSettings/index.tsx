import React, { useContext, useState, useEffect } from 'react';
import { Button, Menu, Dropdown } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { AffiliateContext } from '~/components/Affiliate/AffiliateContextProvider';
import { AffiliatePostback } from '~/components/Affiliate/types';
import AffiliatePostbackForm from './AffiliatePostbackForm';
import { AffiliatePostbackSettingsProps } from './types';

import styles from './AffiliatePostbackSettings.module.scss';

const AffiliatePostbackSettings: React.FC<AffiliatePostbackSettingsProps> = ({
  hasEditRights,
}: AffiliatePostbackSettingsProps) => {

  const { currentAffiliate, setCurrentAffiliate } = useContext(AffiliateContext);
  const [ postbacks, setPostbacks ] = useState<Array<AffiliatePostback>>([]);
  const postbackEvents = ['signup', 'deposit', 'firstDeposit', 'depositThreshold'];

  useEffect(() => {
    if (currentAffiliate.postbacks) {
      setPostbacks(currentAffiliate.postbacks);
    }
  }, [currentAffiliate]);

  const addPostback = (type: string): void => {
    const emptyPostback = {
      marketingSourceIDs: [],
      type,
      thresholds: [],
      countries: [],
      url: '',
    };
    const mutatedPostbacks = [...postbacks];
    mutatedPostbacks.push(emptyPostback);
    setCurrentAffiliate({...currentAffiliate, postbacks: mutatedPostbacks});
  };

  const deletePostback = (index: number): void => {
    const mutatedPostbacks = [...postbacks];
    mutatedPostbacks.splice(index, 1);
    setCurrentAffiliate({...currentAffiliate, postbacks: mutatedPostbacks});
  };

  const postbackSelection = (
    <Menu>
      { postbackEvents.map((postbackEvent, index) => {
        return (
          <Menu.Item 
            key={index}
            onClick={(): void => { addPostback(postbackEvent); }}
          >
            <span>{ postbackEvent }</span>
          </Menu.Item>
        );
      }) }
    </Menu>
  );

  return (
    <div className={styles.settingsForm}>
      <Dropdown 
        overlay={postbackSelection}
        disabled={!hasEditRights}
      >
        <Button 
          className={styles.addPostbackButton}
          type="primary"
          size="small"
          onClick={(e): void => e.preventDefault()}
          icon={ <PlusOutlined /> }
        >
          Add Postback
        </Button>
      </Dropdown>
      <h3 className={styles.formSectionHeader}>Postbacks</h3>
      { postbacks.map((postback: AffiliatePostback, index: number) => {
        return (
          <AffiliatePostbackForm 
            key={index}
            postbackIndex={index}
            postback={postback}
            deletePostback={deletePostback}
            hasEditRights={hasEditRights}
          />
        );
      }) }
    </div>
  );
};

export default AffiliatePostbackSettings;
