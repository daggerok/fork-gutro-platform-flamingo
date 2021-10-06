import React, { useEffect, useContext, useState } from 'react';
import { Form, Input, Switch, Row, Col, Select, Card, notification } from 'antd';
import idx from 'idx';

import { Brand, ValidationObject, ValidationType } from '~/types';

import { AffiliateContext } from '~/components/Affiliate/AffiliateContextProvider';
import { AffiliatePostback } from '~/components/Affiliate/types';

import { convertDateToString } from '~/utils/common';

import { AffiliateBaseSettingsFormProps } from './types';

import styles from './AffiliateBaseSettingsForm.module.scss';

const { Option } = Select;

const AffiliateBaseSettingsForm: React.FC<AffiliateBaseSettingsFormProps> = ({
  hasEditRights,
}: AffiliateBaseSettingsFormProps) => {

  const {
    currentAffiliate,
    setCurrentAffiliate,
    brands,
    selectedBrand,
    setSelectedBrand,
  } = useContext(AffiliateContext);

  const [createdDate, setCreatedDate] = useState<string | null>(null);
  const [updatedDate, setUpdatedDate] = useState<string | null>(null);

  const getSelectedBrandObjectFromOperatorUid = (operatorUid: string): any => {
    return brands.find((brand: Brand) => brand.brand === operatorUid);
  };

  useEffect(() => {
    if (currentAffiliate.operatorUIDs) {
      const brandObject = getSelectedBrandObjectFromOperatorUid(
        currentAffiliate.operatorUIDs[0]
      );
      setSelectedBrand(brandObject);
    } else {
      setSelectedBrand(null);
    }
  }, [currentAffiliate]);

  const containsUnavailableCountries = (brand: Brand): boolean => {

    const brandCountryIsos: Array<string> = brand.countries?.map(({ iso }) => iso);

    currentAffiliate.postbacks.forEach((postback: AffiliatePostback) => {
      if (postback.countries) {
        const unavailable = postback.countries.some((postbackCountry) =>
          brandCountryIsos.every((iso: string) => postbackCountry !== iso)
        );

        const unavailableIsos = postback.countries.filter((postbackCountry) =>
          brandCountryIsos.every((iso: string) => postbackCountry !== iso)
        );

        if (unavailable) {
          throw new Error(`The following selected markets are not available for the brand you changed to: ${unavailableIsos.join(', ')}`);
        }
      }
    });
    return false;
  };

  const openNotification = (error: ValidationObject): void => {
    notification.open({
      type: error.type,
      message: error.message,
      duration: 8,
    });
  };

  const addSelectedBrand = (brandToAdd: string): void => {

    const brand = getSelectedBrandObjectFromOperatorUid(brandToAdd);
    setSelectedBrand(brand);

    try {
      containsUnavailableCountries(brand);
    } catch (e) {
      if (e instanceof Error) {
        const newError = {
          relatedElement: 'postbackCountries',
          type: ValidationType.Warning,
          message: e.toString(),
        };
        openNotification(newError);
      }
    }

    setCurrentAffiliate({
      ...currentAffiliate,
      operatorUIDs: [brandToAdd],
    });
  };

  useEffect(() => {
    if (currentAffiliate?.createdTimestamp) {
      const createdTimestamp = Date.parse(currentAffiliate?.createdTimestamp);
      setCreatedDate(convertDateToString(createdTimestamp));
    }
    if (!currentAffiliate?.createdTimestamp) {
      setCreatedDate(null);
    }
  }, [currentAffiliate.createdTimestamp]);

  useEffect(() => {
    if (currentAffiliate?.updatedTimestamp) {
      const updatedTimestamp = Date.parse(currentAffiliate?.updatedTimestamp);
      setUpdatedDate(convertDateToString(updatedTimestamp));
    }
    if (!currentAffiliate?.updatedTimestamp) {
      setUpdatedDate(null);
    }
  }, [currentAffiliate.updatedTimestamp]);

  const handleEnabledCheckChange = (enabled: boolean): void => {
    setCurrentAffiliate({ ...currentAffiliate, enabled });
  };

  const handleNameChange = (event: any): void => {
    setCurrentAffiliate({
      ...currentAffiliate,
      affiliateName: event.target.value,
    });
  };

  const handleIdChange = (event: any): void => {
    setCurrentAffiliate({
      ...currentAffiliate,
      affiliateId: event.target.value,
    });
  };

  return (
    <Form
      className={styles.settingsForm}
      size={'large'}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      fields={[
        {
          name: ['affiliateName'],
          value: currentAffiliate.affiliateName,
        },
        {
          name: ['affiliateId'],
          value: currentAffiliate.affiliateId,
        },
        {
          name: ['brand'],
          value: idx(selectedBrand, (_) => _.label) || '',
        },
      ]}
    >
      <h3 className={styles.formSectionHeader}>Affiliate Settings</h3>
      <fieldset>
        <Form.Item 
          name="enabled" 
          label="Enabled"
        >
          <Switch
            className={styles.enabledCheck}
            checked={currentAffiliate.enabled}
            onChange={handleEnabledCheckChange}
            disabled={!hasEditRights}
          />
        </Form.Item>
        <Form.Item
          name="affiliateId"
          label="Affiliate id"
          rules={[{ 
            required: true,
            message: 'Please fill in a valid affiliate id.',
          }]}
        >
          <Input
            onChange={handleIdChange}
            disabled={!hasEditRights || Boolean(createdDate)}
          />
        </Form.Item>
        <Form.Item
          name="affiliateName"
          label="Affiliate name"
          rules={[{ 
            required: true,
            message: 'Please fill in a name.',
          }]}
        >
          <Input 
            onChange={handleNameChange} 
            disabled={!hasEditRights} 
          />
        </Form.Item>
        <Form.Item
          name="brand"
          label="Brand"
          rules={[{ 
            required: true,
            message: 'Please select a brand.',
          }]}
        >
          <Select
            disabled={!hasEditRights}
            showSearch
            placeholder='Select brand'
            onChange={addSelectedBrand}
            optionFilterProp='children'
            filterOption={(input, option): boolean =>
              option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {brands.map(
              (brand: Brand): JSX.Element => {
                return (
                  <Option 
                    key={brand.brand} 
                    value={brand.brand}
                  >
                    {brand.label}
                  </Option>
                );
              }
            )}
          </Select>
        </Form.Item>
      </fieldset>
      <Row 
        className={styles.dateElemRow} 
        gutter={8}
      >
        {createdDate && (
          <Col span={12}>
            <Card title="Created">
              <p>{createdDate}</p>
            </Card>
          </Col>
        )}
        {updatedDate && updatedDate !== createdDate && (
          <Col span={12}>
            <Card title="Updated">
              <p>{updatedDate}</p>
            </Card>
          </Col>
        )}

      </Row>
    </Form>
  );
};

export default AffiliateBaseSettingsForm;
