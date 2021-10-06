import { Affiliate, AffiliateApiParams } from '~/components/Affiliate/types';
import { Brand } from '~/types';

export interface AffiliateListProps {
  affiliates?: Array<Affiliate>
  brands: Array<Brand>
}