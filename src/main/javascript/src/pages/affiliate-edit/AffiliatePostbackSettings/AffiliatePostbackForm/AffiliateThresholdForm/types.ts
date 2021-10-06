import { AffiliateThreshold } from '../../../../../components/Affiliate/types';

export type AffiliateThresholdFormProps = {
  index: number;
  threshold: AffiliateThreshold;
  deleteThreshold: ((index: number) => void);
  hasEditRights: boolean;
}