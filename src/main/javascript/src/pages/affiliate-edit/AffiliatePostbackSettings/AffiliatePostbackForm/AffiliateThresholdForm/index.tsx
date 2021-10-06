import React, { useContext, useState } from 'react';

import { 
  Input, 
  Collapse, 
  Row, 
  Col,
  Button,
  InputNumber,
  Alert,
} from 'antd';

import { 
  CloseCircleFilled,
  EditFilled, 
  DeleteFilled,

} from '@ant-design/icons';

import { AffiliateContext } from '~/components/Affiliate/AffiliateContextProvider';

import ConfirmationDialog from '~/components/Common/ConfirmationDialog';

import { AffiliateThresholdFormProps } from './types';

import styles from './AffiliateThresholdForm.module.scss';

const { Panel } = Collapse;

const AffiliateThresholdForm: React.FC<AffiliateThresholdFormProps> = ({
  index,
  threshold,
  deleteThreshold,
  hasEditRights,
}: AffiliateThresholdFormProps) => {

  const { currentAffiliate, setCurrentAffiliate } = useContext(AffiliateContext);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [thresholdToDelete, setThresholdToDelete] = useState<number | null>(null);

  // tslint:disable-next-line
  const handleUrlChange = (event: any): void => {
    threshold.url = event.target.value;
    setCurrentAffiliate({...currentAffiliate});
  };

  const handleAmountChange = (amount: number): void => {
    threshold.amount = Number(amount);
    setCurrentAffiliate({...currentAffiliate});
  };

  const handleDeleteThreshold = (): void => {
    setThresholdToDelete(index);
    setShowConfirmationDialog(true);
  };

  const onOkDeleteThresholdClick = (): void => {
    deleteThreshold(Number(thresholdToDelete));
    setThresholdToDelete(null);
    setShowConfirmationDialog(false);
  };


  return (
    <>
    <Collapse
      expandIcon={({isActive}): JSX.Element => isActive ?  <CloseCircleFilled/> : <EditFilled />}
    >
      { showConfirmationDialog &&
        <ConfirmationDialog 
          onOkClick={onOkDeleteThresholdClick}
          onCancelClick={(): void => { setShowConfirmationDialog(false); }}
          title="Are you sure?" 
          subTitle="This action will remove this threshold setting." 
        />
      }
      <Panel 
        key={index} 
        header={
          <Row className={styles.panelHeaderRow}>
            <Col span="18"><h4>{`Threshold ${index+1}`}</h4></Col>
            <Col span="6">
              <Button
                className={styles.deleteButton}
                type="primary"
                danger
                size="small"
                onClick={(event: any): void => {
                  event.stopPropagation();
                  handleDeleteThreshold();
                }}
                icon={<DeleteFilled />}
                disabled={!hasEditRights}
              />
            </Col>
          </Row>
        }
      > 
        <Row className={styles.formRow}>
          <Col span="4"><label htmlFor="threshold_amount">*Amount (€): </label></Col>
          <Col >
            <InputNumber
              value={threshold.amount}
              name="threshold_amount"
              required
              prefix="€"
              onChange={handleAmountChange}
              type="number"
              disabled={!hasEditRights}
            />
          </Col>
        </Row>

        <Row className={styles.formRow}>
          <Col span="4"><label htmlFor="threshold_url">*Url: </label></Col>
          <Col span="20">
            <label><small><em>Must start with <strong>https://</strong></em></small></label>
            <Input
              value={threshold.url}
              name="threshold_url"
              onChange={handleUrlChange}
              disabled={!hasEditRights}
            />
          </Col>
        </Row>

        { threshold.url && threshold.url.length > 65 &&
          <Row className={styles.formRow}>
            <Col span="24">
              <Alert 
                type="info" 
                message={threshold.url}
              />
            </Col>
          </Row>
        }

      </Panel>
    </Collapse>
    </>
  );
};

export default AffiliateThresholdForm;



