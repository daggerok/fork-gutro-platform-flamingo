import { AffiliatePostback } from '~/components/Affiliate/types';

export type AffiliatePostbackFormProps = {
  postbackIndex: number;
  postback: AffiliatePostback;
  deletePostback: ((index: number) => void);
  hasEditRights: boolean;
};
