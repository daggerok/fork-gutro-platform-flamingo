export type ConfirmationDialogProps = {
    onOkClick: (event: React.MouseEvent) => void;
    onCancelClick: (event: React.MouseEvent) => void;
    title: string;
    subTitle: string | undefined;
}