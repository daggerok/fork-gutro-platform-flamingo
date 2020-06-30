import React from 'react';

import { Modal } from 'antd';

type ConfirmationModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  schedulingPromotionCount: number;
  onOkClick: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  setOpen,
  schedulingPromotionCount,
  onOkClick,
}: ConfirmationModalProps) => {
  return (
    <Modal
      title="Are you sure?"
      visible={open}
      onOk={(): void => onOkClick()}
      onCancel={(): void => setOpen(false)}
    >
      Are you sure you want to schedule these promotions?<br />
      Number of promotions to schedule: <b>{schedulingPromotionCount}</b>
    </Modal>
  );
};

export default ConfirmationModal;
