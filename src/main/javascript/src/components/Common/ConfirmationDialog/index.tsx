import React from 'react';
import { Modal, Result, Button } from 'antd';

import { ConfirmationDialogProps } from './types';

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  onOkClick,
  onCancelClick,
  title,
  subTitle,
}: ConfirmationDialogProps) => {
  return (
    <Modal
      visible={true}
      closable={false}
      footer={null}
      data-testid="confirmation-dialog"
    >
      <Result
        status="warning"
        title={title}
        subTitle={subTitle}
        extra={[
          <Button
            type="default"
            key="cancel"
            onClick={onCancelClick}
            data-testid="confirmation-cancel-button"
          >
            Cancel
          </Button>,
          <Button
            type="primary"
            key="ok"
            onClick={onOkClick}
            data-testid="confirmation-ok-button"
          >
            OK
          </Button>,
        ]}
      />
    </Modal>
  );
};

export default ConfirmationDialog;
