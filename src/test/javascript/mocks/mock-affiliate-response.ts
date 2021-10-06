import { AffiliatePostbackType } from '../../../main/javascript/src/components/Affiliate/types';

const mockAffiliateApiResult = {
  data: [
    {
      affiliateId: '12345',
      affiliateName: 'First Affiliate',
      enabled: true,
      operatorUIDs: ['Gutro'],
      postbacks: [
        {
          name: 'This affiliate has a short description here',
          marketingSourceIDs: ['6789', 'TestingMarketSource'],
          type: AffiliatePostbackType.DEPOSIT,
          url: 'https://leo-aff.free.beeceptor.com/Gutro/{$meta_click_id}/deposit',
          countries: ['AD', 'AT', 'MT', 'IN', 'SE', 'LI'],
        }, 
      ],
    },
    {
      affiliateId: '67890',
      affiliateName: 'Second Affiliate',
      enabled: false,
      operatorUIDs: ['RoyalPanda'],
      postbacks: [
        {
          name: '',
          type: AffiliatePostbackType.SIGNUP,
          url: 'https://leo-aff.free.beeceptor.com/RoyalPanda/{$meta_click_id}/signup',
          countries: ['GB', 'MT'],
        },
      ],
    },
    {
      affiliateId: '67893',
      affiliateName: 'Third Affiliate',
      enabled: true,
      operatorUIDs: ['GoGoCasino'],
      postbacks: [
        {
          name: '',
          type: AffiliatePostbackType.THRESHOLD_DEPOSIT,
          thresholds: [
            {
              amount: 100,
              url: 'https://leo-aff.free.beeceptor.com/GoGoCasino/{$meta_click_id}/depositThreshold',
            },
            {
              amount: 500,
              url: 'https://leo-aff.free.beeceptor.com/GoGoCasino/{$meta_click_id}/depositThreshold',
            },
            {
              amount: 1000,
              url: 'https://leo-aff.free.beeceptor.com/GoGoCasino/{$meta_click_id}/depositThreshold',
            },
          ],
          countries: ['SE', 'FI'],
        },
        {
          name: '',
          type: AffiliatePostbackType.FIRST_DEPOSIT,
          thresholds: [],
          url: 'https://leo-aff.free.beeceptor.com/GoGoCasino/{$meta_click_id}/firstDeposit',
        },
      ],
    },
  ],
};

export default mockAffiliateApiResult;