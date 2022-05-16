import {
  Affiliate,
  AffiliatePostback,
  AffiliateThreshold,
  AffiliatePostbackType,
} from './../types';

import { Brand, ValidationObject, ValidationType } from '~/types';

import { validateUrl } from '~/utils/common';
import { containsUnavailableCountries } from '~/pages/affiliate-edit/AffiliateBaseSettingsForm/utils';

const validateThresholds = (threshold: AffiliateThreshold, postbackId: number, thresholdIndex: number): ValidationObject[] => {
  const errors: ValidationObject[] = [];

  if (!threshold.amount) {
    errors.push({
      relatedElement: 'threshold_amount',
      type: ValidationType.Error,
      message: `Missing amount on threshold ${thresholdIndex + 1}, on postback with ID ${postbackId}.`,
    });
  }
  if (!threshold.url) {
    errors.push({
      relatedElement: 'threshold_url',
      type: ValidationType.Error,
      message: `Missing URL on threshold ${thresholdIndex + 1}, on postback with ID ${postbackId}.`,
    });
  }

  if (threshold.url) {
    const valid = validateUrl(threshold.url);
    if (!valid) {
      errors.push({
        relatedElement: 'threshold_url',
        type: ValidationType.Error,
        message: `URL is not valid on threshold ${thresholdIndex + 1}, it has to start with https://, on postback with ID ${postbackId}.`,
      });
    }
  }

  return errors;
};

const validatePostback = (postback: AffiliatePostback, temporaryId: number, selectedBrands: Brand[]): ValidationObject[] => {
  let errors: ValidationObject[] = [];

  const postbackId = postback.id ? postback.id : temporaryId;

  if (!postback.url && postback.type !== AffiliatePostbackType.THRESHOLD_DEPOSIT) {
    errors.push({
      relatedElement: 'postback_url',
      type: ValidationType.Error,
      message: `Missing URL. Postback with ID ${postbackId}.`,
    });
  }

  if (postback.url) {
    const valid = validateUrl(postback.url);

    if (!valid && postback.type !== AffiliatePostbackType.THRESHOLD_DEPOSIT) {
      errors.push({
        relatedElement: 'postback_url',
        type: ValidationType.Error,
        message: `URL is not valid, it has to start with https://. Postback with ID ${postbackId}. (${postback.url})`,
      });
    }
  }

  if (postback.type === AffiliatePostbackType.THRESHOLD_DEPOSIT) {
    if (!postback.thresholds?.length) {
      errors.push({
        type: ValidationType.Error,
        message: `Missing thresholds. Postback with ID ${postbackId}.`,
      });
    }
    if (postback.thresholds?.length) {
      postback.thresholds.forEach((threshold: AffiliateThreshold, index: number) => {
        const thresholdErrors = validateThresholds(threshold, postbackId, index);
        if (thresholdErrors.length) {
          errors = errors.concat(thresholdErrors);
        }
      });
    }
  }

  selectedBrands.forEach((brand) => {
    try {
      containsUnavailableCountries(brand, postback.countries);
    } catch (e) {
      if (e instanceof Error) {
        errors.push({
          type: ValidationType.Error,
          message: `${brand.label} - ${postback.name || postback.id}: ${e.toString()}`,
        });
      }
    }
  });

  return errors;
};

export const affiliateValidation = (affiliate: Affiliate, selectedBrands: Brand[]): ValidationObject[] => {
  const errors: ValidationObject[] = [];

  const {
    affiliateId,
    affiliateName,
    operatorUIDs,
    postbacks,
  } = affiliate;

  if (!affiliateId || !affiliateId.length) {
    errors.push({
      type: ValidationType.Error,
      message: 'Missing required field: Affiliate id',
    });
  }
  if (!affiliateName || !affiliateName.length) {
    errors.push({
      type: ValidationType.Error,
      message: 'Missing required field: Affiliate name',
    });
  }
  if (!operatorUIDs || operatorUIDs.length < 1) {
    errors.push({
      type: ValidationType.Error,
      message: 'Missing required field: Brand',
    });
  }

  if (!postbacks || !postbacks.length) {
    errors.push({
      type: ValidationType.Error,
      message: 'Must have at least one postback.',
    });
  }

  postbacks?.forEach((postback: AffiliatePostback, index: number) => {
    validatePostback(postback, index, selectedBrands)
      .forEach(error => errors.push(error));
  });

  return errors;
};
