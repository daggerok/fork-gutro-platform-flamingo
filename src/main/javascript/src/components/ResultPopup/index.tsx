import React from 'react';
import { Modal, Result, Button } from 'antd';

import { ResultPopupProps } from './types';

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
