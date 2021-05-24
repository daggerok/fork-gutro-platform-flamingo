import { ResultStatusType } from 'antd/lib/result';

export type ResultPopupData = {
    status: ResultStatusType;
    message?: string;
}

export type CSVUploadFormProps = {
    onUpdate(): void;
};

export type ConfirmationModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    schedulingPromotionCount: number;
    onOkClick: () => void;
};