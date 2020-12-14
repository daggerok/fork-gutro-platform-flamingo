import React from 'react';
import { Modal, Result, Button } from 'antd';

type ConfirmationDialogProps = {
  onOkClick: (event: React.MouseEvent) => void;
  onCancelClick: (event: React.MouseEvent) => void;
  title: string;
  subTitle: string | undefined;
}

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
