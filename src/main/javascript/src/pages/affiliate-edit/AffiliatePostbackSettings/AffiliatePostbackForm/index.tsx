import {
  Alert, Button, Col, Collapse, Divider, Form, Input, message, Row, Tag, Typography,
} from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { AffiliateContext } from '~/components/Affiliate/AffiliateContextProvider';
import { AffiliatePostbackType } from '~/components/Affiliate/types';
import ConfirmationDialog from '~/components/Common/ConfirmationDialog';
import { validateUrl } from '~/utils/common';

import {
  CloseCircleFilled, DeleteFilled, EditFilled, PlusCircleOutlined, PlusOutlined,
} from '@ant-design/icons';

import AffiliateDrawer from '../AffiliateDrawer';
import styles from './AffiliatePostbackForm.module.scss';
import AffiliateThresholdForm from './AffiliateThresholdForm';
import AvailableCountriesList from './AvailableCountriesList';
import { AffiliatePostbackFormProps } from './types';

const { Panel } = Collapse;
const { Text } = Typography;

const AffiliatePostbackForm: React.FC<AffiliatePostbackFormProps> = ({
  postbackIndex,
  postback,
  deletePostback,
  hasEditRights,
}: AffiliatePostbackFormProps) => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [postbackToDelete, setPostbackToDelete] = useState<number | null>(null);
  const [selectedMarketSources, setSelectedMarketingSources] = useState<
    Array<string>
  >([]);
  const [selectedCountries, setSelectedCountries] = useState<Array<string>>([]);

  const {
    currentAffiliate,
    setCurrentAffiliate,
    setAffiliateErrors,
    selectedBrands,
  } = useContext(AffiliateContext);

  let marketSourceToAdd = '';

  useEffect(() => {
    setSelectedEvent(postback.type);
    if (!postback.marketingSourceIDs) {
      setSelectedMarketingSources([]);
    } else {
      setSelectedMarketingSources(postback.marketingSourceIDs);
    }

    if (postback.countries) {
      setSelectedCountries(postback.countries);
    }
  }, [currentAffiliate]);

  // tslint:disable-next-line
  const handleNameChange = (event: any): void => {
    postback.name = event.target.value;

    setCurrentAffiliate({ ...currentAffiliate });
  };

  // tslint:disable-next-line
  const handleUrlChange = (event: any): void => {
    const validated = validateUrl(event.target.value);
    postback.url = event.target.value;
    if (!validated) {
      const errors = [
        {
          error: true,
          errorMessage: 'Postback url not valid',
        },
      ];
      setAffiliateErrors([...errors]);
    }

    setCurrentAffiliate({ ...currentAffiliate });
  };

  // tslint:disable-next-line
  const handleMarketingSourceChange = (event: any): void => {
    marketSourceToAdd = event.target.value;
  };

  const updateMarketingSourceIds = (
    mutatedMarketSources: Array<string>
  ): void => {
    setSelectedMarketingSources(mutatedMarketSources);
    postback.marketingSourceIDs = mutatedMarketSources;

    setCurrentAffiliate({ ...currentAffiliate });
  };

  const addMarketSource = (): void => {
    if (!marketSourceToAdd) {
      return;
    }
    const mutatedSelectedMarketSources = [...selectedMarketSources];
    mutatedSelectedMarketSources.push(marketSourceToAdd);
    marketSourceToAdd = '';
    updateMarketingSourceIds(mutatedSelectedMarketSources);
  };

  const removeSelectedMarketSource = (marketSourceToRemove: string): void => {
    const mutatedSelectedMarketSources = [...selectedMarketSources];
    if (!mutatedSelectedMarketSources.find((selectedMarketSource) => selectedMarketSource === marketSourceToRemove)) {
      return;
    }

    const index = mutatedSelectedMarketSources.indexOf(marketSourceToRemove);
    if (index > -1) {
      mutatedSelectedMarketSources.splice(index, 1);
    }

    updateMarketingSourceIds(mutatedSelectedMarketSources);
  };

  const handleDeletePostback = (index: number): void => {
    setPostbackToDelete(index);
    setShowConfirmationDialog(true);
  };

  const deleteThreshold = (index: number): void => {
    const { thresholds } = postback;
    if (thresholds) {
      const mutatedThresholds = [...thresholds];
      mutatedThresholds.splice(index, 1);
      postback.thresholds = mutatedThresholds;
      setCurrentAffiliate({ ...currentAffiliate });
    }
  };

  const onOkDeletePostbackClick = (): void => {
    deletePostback(Number(postbackToDelete));
    setPostbackToDelete(null);
    setShowConfirmationDialog(false);
  };

  const addThreshold = (): void => {
    const emptyThreshold = {
      amount: null,
      url: null,
    };

    if (!currentAffiliate?.postbacks.length) {
      return;
    }

    const depositThresholdPostback = currentAffiliate.postbacks[postbackIndex];

    if (!depositThresholdPostback.thresholds) {
      depositThresholdPostback.thresholds = [];
    }

    const mutatedThresholds = [...depositThresholdPostback.thresholds];

    mutatedThresholds.push(emptyThreshold);
    depositThresholdPostback.thresholds = mutatedThresholds;

    setCurrentAffiliate({ ...currentAffiliate });
  };

  const updateCountries = (mutatedSelectedCountries: string[]): void => {
    postback.countries = mutatedSelectedCountries;
    setSelectedCountries(mutatedSelectedCountries);
    setCurrentAffiliate({ ...currentAffiliate });
  };

  const handleCountryChange = (country: string): void => {
    if (!hasEditRights) {
      message.error('You do not have permission to change that!');
      return;
    }
    const mutatedSelectedCountries = [...selectedCountries];
    if (mutatedSelectedCountries.includes(country)) {
      const index = mutatedSelectedCountries.indexOf(country);
      mutatedSelectedCountries.splice(index, 1);
    } else {
      mutatedSelectedCountries.push(country);
    }

    updateCountries(mutatedSelectedCountries);
  };

  const { name } = postback || null;
  const description =
    name && name.length > 30 ? `${name.substring(0, 30)}...` : name;

  const panelHeader = (
    <Row className={styles.panelHeaderRow}>
      <Col span="7">
        <h3>{selectedEvent}</h3>
      </Col>
      <Col span="12">
        <h4>{postback.name && <span>{description}</span>}</h4>
      </Col>
      <Col span="1">
        <Tag color="#BE94F0">
          <strong>ID</strong> {postback.id ? postback.id : postbackIndex}
        </Tag>
      </Col>
      <Col span="4">
        <Button
          className={styles.deleteButton}
          type="primary"
          danger
          size="small"
          icon={<DeleteFilled />}
          onClick={(event: any): void => {
            event.stopPropagation();
            handleDeletePostback(postbackIndex);
          }}
          disabled={!hasEditRights}
        />
      </Col>
    </Row>
  );

  return (
    <Collapse
      accordion
      expandIcon={({ isActive }): JSX.Element =>
        isActive ? <CloseCircleFilled /> : <EditFilled />
      }
      defaultActiveKey={postback.id ? -1 : postbackIndex}
      data-testid="postback-accordion"
    >
      {showConfirmationDialog && (
        <ConfirmationDialog
          onOkClick={onOkDeletePostbackClick}
          onCancelClick={(): void => {
            setShowConfirmationDialog(false);
          }}
          title="Are you sure?"
          subTitle="This action will remove this postback setting."
        />
      )}
      <Panel
        header={panelHeader}
        key={postbackIndex}
        style={{
          position: 'relative',
          backgroundColor: postback.id ? '#fafafa' : '#ffb2b2',
        }}
      >
        <Form
          className={styles.settingsForm}
          size={'large'}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          fields={[
            {
              name: ['postbackName'],
              value: postback.name,
            },
            {
              name: ['url'],
              value: postback.url,
            },
            {
              name: ['marketingSources'],
              value: marketSourceToAdd,
            },
          ]}
        >
          <fieldset>
            <Form.Item label="Name">
              <Input.TextArea
                name="postbackName"
                disabled={!hasEditRights}
                onChange={handleNameChange}
                value={postback.name}
                maxLength={255}
              />
              <Text type="secondary">{`Max 255 characters. Current count: ${postback?.name?.length}.`}</Text>
            </Form.Item>
            <Form.Item
              name="postbackCountries"
              label="Countries"
            >
              {(!selectedBrands || !selectedBrands.length) && (
                <Alert
                  type="warning"
                  message="Select brand to view available markets."
                />
              )}
              <AvailableCountriesList
                selectedCountries={selectedCountries}
                selectedBrands={selectedBrands}
                onCountryToggled={handleCountryChange}
              />
            </Form.Item>
            <Form.Item label="Marketing sources">
              <Row>
                <Col span={12}>
                  <div className={styles.tagContainer}>
                    {selectedMarketSources &&
                      selectedMarketSources.map((marketSource): JSX.Element => {
                        return (
                          <Tag
                            className="marketingSourceTag"
                            key={marketSource}
                            color="magenta"
                            closable={hasEditRights}
                            onClose={(): void => {
                              removeSelectedMarketSource(marketSource);
                            }}
                          >
                            {marketSource}
                          </Tag>
                        );
                      })}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={20}>
                  <Form.Item name="marketingSources">
                    <Input
                      disabled={!hasEditRights}
                      allowClear
                      onChange={handleMarketingSourceChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button
                    disabled={!hasEditRights}
                    style={{ width: '100%' }}
                    icon={<PlusCircleOutlined />}
                    type="primary"
                    onClick={(): void => {
                      addMarketSource();
                    }}
                  />
                </Col>
              </Row>
            </Form.Item>
            {selectedEvent !== AffiliatePostbackType.THRESHOLD_DEPOSIT && (
              <Form.Item
                label="Url"
                name="url"
                rules={[
                  {
                    required: true,
                    type: 'url',
                    message:
                      'Make sure you use a valid url and that it starts with https://',
                  },
                ]}
              >
                <label>
                  <small>
                    <em>
                      Must start with <strong>https://</strong>
                    </em>
                  </small>
                </label>
                <Input
                  disabled={!hasEditRights}
                  onChange={handleUrlChange}
                  value={postback.url}
                />
                {postback.url && postback.url.length > 65 && (
                  <Alert
                    type="info"
                    message={postback.url}
                  />
                )}
              </Form.Item>
            )}
            {selectedEvent === AffiliatePostbackType.THRESHOLD_DEPOSIT && (
              <>
                <Row justify="end">
                  <Divider />
                  <Col>
                    <Button
                      disabled={!hasEditRights}
                      className={styles.addThresholdButton}
                      type="primary"
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={addThreshold}
                    >
                      Add Threshold
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <h4>Threshold settings</h4>
                  </Col>
                </Row>
                {postback.thresholds &&
                  postback.thresholds?.map((threshold, index): JSX.Element => {
                    return (
                      <AffiliateThresholdForm
                        key={index}
                        index={index}
                        threshold={threshold}
                        deleteThreshold={deleteThreshold}
                        hasEditRights={hasEditRights}
                      />
                    );
                  })}
              </>
            )}
            <Row justify="end">
              <Col>
                <AffiliateDrawer />
              </Col>
            </Row>
          </fieldset>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default AffiliatePostbackForm;
