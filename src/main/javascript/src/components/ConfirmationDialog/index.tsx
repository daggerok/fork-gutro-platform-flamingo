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
    >
      <Result
        status="warning"
        title={title}
        subTitle={subTitle}
        extra={[
          <Button
            danger
            type="primary"
            key="ok"
            onClick={onOkClick}
          >
            OK
          </Button>,
          <Button
            type="default"
            key="cancel"
            onClick={onCancelClick}
          >
            Cancel
          </Button>,
        ]}
      />
    </Modal>
  );
};

export default ConfirmationDialog;
