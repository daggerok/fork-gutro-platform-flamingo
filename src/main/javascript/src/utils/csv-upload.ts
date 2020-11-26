'use strict';

import { formatDateAsUTC } from './common';
import { UploadFile } from 'antd/lib/upload/interface';
import moment from 'moment';

export interface ScheduledPlayer {
  playerUid: string;
  promotionUid: string;
  scheduled: string | null;
  amount: string | null;
}


const readFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();

    fileReader.onload = (e): void => {
      if (e?.target && e.target.readyState == FileReader.DONE) {
        resolve(e.target.result?.toString());
      }
    };
    
    fileReader.readAsText(file);
  });
};

const mergeFiles = (fileContents: Array<string>): Array<ScheduledPlayer> => {
  return fileContents.reduce(
    (accumulator: Array<ScheduledPlayer>, file: string): Array<ScheduledPlayer> => {
      
      const fileRows = file
        .split('\n')
        .map(it => it.trim())
        .filter(it => Boolean(it));

      const headerLine = fileRows.shift();
      const headers = headerLine?.split(',').map(it => it.trim());

      if (!headers || headers.length === 0) {
        throw 'CSV did not have a header line';
      }

      const playerIdIndex = headers.indexOf('playerId');
      const promotionIdIndex = headers.indexOf('promotionId');
      const amountIndex = headers.indexOf('amount');

      if (playerIdIndex === -1) {
        throw 'CSV did not have a "playerId" header.';
      }
      if (promotionIdIndex === -1) {
        throw 'CSV did not have a "promotionId" header.';
      }

      const players = fileRows.map(
        (playerRow: string): ScheduledPlayer => {
          const playerRowParts = playerRow.split(',').map(it => it.trim());
          const playerUid = playerRowParts[playerIdIndex];
          const promotionUid = playerRowParts[promotionIdIndex];
          const amount = amountIndex ? playerRowParts[amountIndex] : null;
        
          return {
            playerUid,
            promotionUid,
            scheduled: null,
            amount,
          };
        }
      );

      return [
        ...accumulator,
        ...players,
      ];
    },
    []
  );
};

export const getPlayerListFromFiles = async (files: Array<UploadFile>, scheduleDate: Date): Promise<Array<ScheduledPlayer>> => {
  const fileContents = await Promise.all((files || []).map(
    (file: UploadFile): Promise<string> => readFile((file.originFileObj as File))
  ));

  const scheduledPlayers = mergeFiles(fileContents);
  const scheduleDateString = formatDateAsUTC(scheduleDate);

  const schedulingPromotions = scheduledPlayers.map(
    (row: ScheduledPlayer): ScheduledPlayer => {
      return {
        ...row,
        scheduled: scheduleDateString,
      };
    }
  );

  return schedulingPromotions;
};

export const isBeforeToday = (date: moment.Moment): boolean => {
  return date && date < moment().startOf('day');
};
