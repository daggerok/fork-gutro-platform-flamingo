import { CampaignDetails, CustomerPromotionDetails } from '~/pages/csv-upload/CampaignDetails/types';
import { formatDateTimeWithWords, formatDateTimeWithWordsSeparator, roundToTwoDecimals } from '~/utils/common';

const SEPARATOR = ',';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-function-return-type */
const formatArrayIntoCsv = (arrayData: any[]): string => {
  const escapeString = (item: any): string => (typeof item === 'string') ? `${item}` : String(item);
  const nullConverter = (item: any): string => item === null ? '' : escapeString(item);
  const numberConverter = (item: any): string => {
    if(!item.length|| isNaN(item)) {
      return item;
    }

    item = roundToTwoDecimals(item).toString();
    return item.length === 13 ? formatDateTimeWithWords(new Date(Number(item))) : item;
  };

  const arrayToCsv = (arr: any[]): string => arr
    .map(nullConverter)
    .map(numberConverter)
    .join(SEPARATOR);

  const rowKeysToCsv = (row: Record<string, unknown>) => arrayToCsv(Object.keys(row));
  const rowToCsv = (row: { [s: string]: unknown } | ArrayLike<unknown>): string => arrayToCsv(Object.values(row));
  const rowsToCsv = (arr: any[]): string => arr.map((row: any) => rowToCsv(row)).join('\n');

  const headerRow = rowKeysToCsv(arrayData[0]);
  const dataRows = rowsToCsv(arrayData);

  return `${headerRow}\n${dataRows}`;
};

export const downloadCsvFile = (fileName: string, data: string): void => {
  const link = window.document.createElement('a');

  link.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(data));
  link.setAttribute('download', `${fileName}.csv`);
  link.click();
};

/*
  Specific implementations below
*/
export const generateReportFromCampaign = (campaignId: string | null, campaignDetails: CampaignDetails | null): void => {
  if(!campaignDetails) {
    console.error('Attempted to create report from empty campaign');
    return;
  }

  const scheduledPlayers: CustomerPromotionDetails[] = campaignDetails.customerPromotions || [];
  const formattedData = formatArrayIntoCsv(scheduledPlayers);
  const createdDate = new Date(campaignDetails.createDate);

  downloadCsvFile(`flamingo_report_${campaignId}_${formatDateTimeWithWordsSeparator(createdDate, '-')}`, formattedData);
};
