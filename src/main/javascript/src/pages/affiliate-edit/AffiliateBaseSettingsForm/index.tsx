import React, { useEffect, useContext, useState } from 'react';
import {
  Form,
  Input,
  Switch,
  Row,
  Col,
  Select,
  Card,
} from 'antd';

import { Brand } from '~/types';

import { AffiliateContext } from '~/components/Affiliate/AffiliateContextProvider';

import { convertDateToString } from '~/utils/common';

import { AffiliateBaseSettingsFormProps } from './types';

import styles from './AffiliateBaseSettingsForm.module.scss';
import { getSelectedBrandObjectFromOperatorUid } from './utils';

const { Option } = Select;

const AffiliateBaseSettingsForm: React.FC<AffiliateBaseSettingsFormProps> = ({
  hasEditRights,
}: AffiliateBaseSettingsFormProps) => {
  const { currentAffiliate, setCurrentAffiliate, brands, setSelectedBrands } =
    useContext(AffiliateContext);

  const [createdDate, setCreatedDate] = useState<string | null>(null);
  const [updatedDate, setUpdatedDate] = useState<string | null>(null);

  useEffect(() => {
    if (currentAffiliate.operatorUIDs) {
      const brandObjects = currentAffiliate.operatorUIDs.map(
        operatorUid => getSelectedBrandObjectFromOperatorUid(operatorUid, brands)
      );

      setSelectedBrands(brandObjects);
    }
  }, [currentAffiliate]);

  const addSelectedBrand = (operatorUIDs: string[]): void => {
    setCurrentAffiliate({
      ...currentAffiliate,
      operatorUIDs,
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
          name: ['brands'],
          value: currentAffiliate.operatorUIDs || [],
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
            data-testid="affiliate-enabled"
          />
        </Form.Item>
        <Form.Item
          name="affiliateId"
          label="Affiliate id"
          rules={[
            {
              required: true,
              message: 'Please fill in a valid affiliate id.',
            },
          ]}
        >
          <Input
            onChange={handleIdChange}
            disabled={!hasEditRights || Boolean(createdDate)}
            data-testid="affiliate-id"
          />
        </Form.Item>
        <Form.Item
          name="affiliateName"
          label="Affiliate name"
          rules={[
            {
              required: true,
              message: 'Please fill in a name.',
            },
          ]}
        >
          <Input
            onChange={handleNameChange}
            disabled={!hasEditRights}
            data-testid="affiliate-name"
          />
        </Form.Item>
        <Form.Item
          name="brands"
          label="Brand"
          data-testid="affiliate-brands"
          rules={[
            {
              required: true,
              message: 'Please select brands.',
            },
          ]}
        >
          <Select
            disabled={!hasEditRights}
            showSearch
            mode="multiple"
            placeholder="Select brands"
            onChange={addSelectedBrand}
            optionFilterProp="children"
            data-testid="affiliate-brand-select"
            filterOption={(input, option): boolean => {
              const children: any = option?.children;

              return children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
          >
            {brands.map(({ brand, label }: Brand): JSX.Element => {
              return (
                <Option
                  key={brand}
                  value={brand}
                  data-testid={`select-brand-${brand}`}
                >
                  {label}
                </Option>
              );
            })}
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
