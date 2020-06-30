import React from 'react';
import { Modal, Result, Button } from 'antd';
import { ResultStatusType } from 'antd/lib/result';

type ResultPopupProps = {
  onOkClick: (event: React.MouseEvent) => void;
  title: string;
  subTitle: string | undefined;
  status: ResultStatusType;
}

const ResultPopup: React.FC<ResultPopupProps> = ({
  onOkClick,
  title,
  subTitle,
  status,
}: ResultPopupProps) => {
  return (
    <Modal
      visible={true}
      closable={false}
      footer={null}
    >
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={[
          <Button
            type="primary"
            key="console"
            onClick={onOkClick}
          >
            OK
          </Button>,
        ]}
      />
    </Modal>
  );
};

export default ResultPopup;
