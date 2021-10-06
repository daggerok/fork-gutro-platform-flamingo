export type ConfirmationDialogProps = {
    onOkClick: (event: any) => void;
    onCancelClick: (event: any) => void;
    title: string;
    subTitle: string | undefined;
}