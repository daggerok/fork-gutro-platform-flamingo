import React, { useEffect, useContext, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Tabs, Alert, message, notification } from 'antd';
import classNames from 'classnames';

import {
  SaveOutlined,
  DeleteOutlined,
  SettingOutlined,
  TableOutlined,
} from '@ant-design/icons';

import { getBrandsWithDetails } from '~/api/brand';

import {
  createAffiliate,
  updateAffiliate,
  deleteAffiliate,
  getAffiliateById,
} from '~/api/affiliate';

import { ApiError, ApiResult, Page, Role, ValidationObject } from '~/types';

import { getFullPath } from '~/utils/routes';
import { hasRole } from '~/utils/role-check';

import ConfirmationDialog from '~/components/Common/ConfirmationDialog';
import Layout from '~/components/Layout';
import PageHeader from '~/components/Layout/PageHeader';
import { AffiliateContext } from '~/components/Affiliate/AffiliateContextProvider';
import { affiliateValidation } from '~/components/Affiliate/utils/validation';

import AffiliateBaseSettingsForm from './AffiliateBaseSettingsForm';
import AffiliatePostbackSettings from './AffiliatePostbackSettings';
import AffiliatePostbackList from './AffiliatePostbackSettings/AffiliatePostbackList';

import { IdParam } from './types';

import styles from './AffiliateEdit.module.scss';

const { TabPane } = Tabs;

const AffiliateEdit: React.FC = () => {

  const { 
    currentAffiliate, 
    setCurrentAffiliate,
    savedAffiliate,
    setSavedAffiliate,
    brands,
    setBrands,
    setSaved,
    saved,
    selectedBrands,
  } = useContext(AffiliateContext);

  const [title, setTitle] = useState('Add Affiliate');
  const [currentAffiliateId, setCurrentAffiliateId] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean | null>(null);

  const params = useParams<IdParam>();
  const history = useHistory();

  const hasEditRights = hasRole(Role.AFFILIATE_WRITE);

  useEffect(() => {
    if (!saved) {
      // eslint-disable-next-line
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }
  }, [saved]);

  useEffect(() => {
    const { id } = params;
    setCurrentAffiliateId(id);
  }, [params]);

  useEffect(() => {
    setSaved(savedAffiliate === currentAffiliate);
  }, [currentAffiliate, savedAffiliate]);

  const createNewAffiliate = (): void => {
    setCurrentAffiliate({
      affiliateId: null,
      affiliateName: null,
      createdTimestamp: null,
      updatedTimestamp: null,
      enabled: false,
      operatorUIDs: [],
      postbacks: [],
    });
    setSaved(true);
  };

  const saveNewAffiliate = (): void => {
    const hide = message.loading('Saving affiliate');

    createAffiliate(currentAffiliate)
      .then((response: ApiResult) => {
        if (response.status === 201) {
          message.success('Affiliate saved');
          setCurrentAffiliate(response.data);
          setSavedAffiliate({...currentAffiliate});
          const affiliateId = response.data?.affiliateId;
          let affiliateEditPath = getFullPath(Page.AffiliateEdit);
          affiliateEditPath = `${affiliateEditPath}/${affiliateId}`;
          history.push(affiliateEditPath);
        } else {
          message.error(`${response.status} ${response.statusText}`);
        }
        hide();
      })
      .catch((error: ApiError) => {
        setSaved(false);
        message.error(`${error.message}`, 2);
        hide();
      });
  };

  const updateExistingAffiliate = (): void => {
    const hide = message.loading('Updating affiliate');

    updateAffiliate(currentAffiliate)
      .then((response: ApiResult) => {
        if (response.status === 202) {
          message.success('Affiliate updated');
          setCurrentAffiliate(response.data);
          setSavedAffiliate(response.data);
        } else {
          message.error(`${response.status} ${response.statusText}`);
        }
        hide();
      })
      .catch((error: ApiError) => {
        setSaved(false);
        hide();
        message.error(`${error.message}`, 2);
      });
  };

  const openNotification = (error: ValidationObject): void => {
    notification.open({
      placement: 'top',
      type: error.type,
      message: error.message,
      duration: 8,
      style: {
        width: '100%',
      },
    });
  };

  const onAffiliateSave = (): void => {
    const errors = affiliateValidation(currentAffiliate, selectedBrands);

    if (errors.length) {
      errors.forEach((error) => { if (error) { openNotification(error); }});
      return;
    }
    if (!currentAffiliate.createdTimestamp) {
      saveNewAffiliate();
      return;
    }
    updateExistingAffiliate();
  };

  const onAffiliateDelete = (): void => {
    setShowDeleteConfirmation(true);
  };

  const onDeleteClose = (): void => {
    history.push(getFullPath(Page.Affiliates));
  };

  const deleteAffiliateCleanup = (): void => {
    setCurrentAffiliate(null);
    setSavedAffiliate(null);
    setSaved(true);
    message.success('Affiliate deleted', 1, onDeleteClose);
  };

  const deleteAffiliateFromDB = (): void => {
    const hide = message.loading('Deleting affiliate');

    if (!currentAffiliate.affiliateId) { 
      hide(); 
      deleteAffiliateCleanup();
      return;
    }

    deleteAffiliate(currentAffiliate.affiliateId)
      .then((response) => {
        if (response.status === 204) {
          deleteAffiliateCleanup();
        } else {
          message.error(`${response.status} ${response.statusText}`);
        }
        hide();
      })
      .catch((error: ApiError) => {
        setSaved(false);
        hide();
        message.error(`${error.message}`);
      });
  };

  const onOkDeleteAffiliateClick = (): void => {
    deleteAffiliateFromDB();
    setShowDeleteConfirmation(false);
  };

  useEffect(() => {
    if (!currentAffiliateId) {
      createNewAffiliate();
      return;
    }

    getAffiliateById(currentAffiliateId)
      .then((response: ApiResult) => {
        if (response.status === 200) {
          setCurrentAffiliate(response.data); 
          setSavedAffiliate(response.data);
          setTitle('Edit Affiliate');
          return response.data;
        } else {
          throw `${response.status} ${response.statusText}`;
        }
      })
      .catch((error: ApiError) => { message.error(error.message);});
  
  }, [currentAffiliateId]);

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

  useEffect(() => {
    if (!brands.length) { getBrandsFromApi(); }
    setSavedAffiliate(null);
  }, []);

  return (
    <Layout>
      <PageHeader
        title={title}
        subtitle="Affiliate postback configurations"
        backgroundHex="#FC8EAC"
        backPath={getFullPath(Page.Affiliates)}
      />
      { !saved && 
        <Alert 
          type="warning" 
          message="You have unsaved changes" 
          showIcon
        />
      }
      <div className={styles.affiliateActionRow}>
        <Button
          className={styles.deleteAffiliateButton}
          type="default"
          onClick={onAffiliateDelete}
          icon={<DeleteOutlined />}
          size="large"
          disabled={!hasEditRights || !currentAffiliate?.createdTimestamp}
        >
          Delete
        </Button>
        <Button
          type="primary"
          onClick={onAffiliateSave}
          icon={<SaveOutlined />}
          size="large"
          disabled={!hasEditRights || saved}
        >
          Save
        </Button>
      </div>
      { showDeleteConfirmation &&
        <ConfirmationDialog 
          onOkClick={onOkDeleteAffiliateClick}
          onCancelClick={(): void => { setShowDeleteConfirmation(false); }}
          title="Are you sure?" 
          subTitle="This action will delete this affiliate." 
        />
      }
      { !hasEditRights && 
        <Alert 
          showIcon
          type="info" 
          message="READ ONLY" 
        />
      }
      <main className={classNames('main', styles.main)}>
        {currentAffiliate ? (
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <SettingOutlined />
                  Affiliate Settings
                </span>
              }
              key="1"
            >
              <div className={styles.formWrapper}>
                <AffiliateBaseSettingsForm hasEditRights={hasEditRights}/>
                <AffiliatePostbackSettings hasEditRights={hasEditRights}/>
              </div>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <TableOutlined />
                  Postback Overview
                </span>
              }
              key="2"
              disabled={!currentAffiliate.postbacks}
            >
              <AffiliatePostbackList postbacks={currentAffiliate.postbacks} />
            </TabPane>
          </Tabs>
        ) : null}
      </main>
    </Layout>
  
  );
};

export default AffiliateEdit;
