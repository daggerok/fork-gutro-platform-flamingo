import { ResultStatusType } from 'antd/lib/result';

export type ResultPopupProps = {
  onOkClick: (event: React.MouseEvent) => void;
  title: string;
  subTitle: string | undefined;
  status: ResultStatusType;
}