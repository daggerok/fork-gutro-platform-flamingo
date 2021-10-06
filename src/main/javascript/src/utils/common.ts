
export const formatDateAsUTC = (date: Date): string => {
  return date.toJSON()
    .replace('T', ' ')
    .substr(0, 19);
};

export const formatDateWithWords = (date: Date): string => {
  return date
    .toDateString()
    .split(' ')
    .slice(1, 3)
    .join(' ');
};

// add zero in front of values from 0 to 9. 
export const addZero = (numberToFix: number): string => { 
  let dateString =  numberToFix.toString();
  if (numberToFix <= 9) { 
    dateString = '0' + numberToFix.toString();
  }
  return dateString;
};

// timestamp to format 00-00-00 00:00:00
export const convertDateToString = (timestamp: number): string => {
  const date = new Date(timestamp);
  const [month, day, year] = [date.getMonth() + 1, date.getDate(), date.getFullYear()];
  const [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];

  return `${year}-${addZero(month)}-${addZero(day)} ${addZero(hour)}:${addZero(minutes)}:${addZero(seconds)}`;
};

export const formatDateTimeWithWords = (date: Date): string => {
  const datePart = formatDateWithWords(date);
  const timePart = date.toTimeString().substr(0, 5);

  return `${datePart} ${timePart}`;
};

export const formatDateTimeWithWordsSeparator = (date: Date, separator: string): string => {
  return formatDateTimeWithWords(date).replace(/\s/g, separator);
};

export const getTimeZoneOffset = (): string => {
  const hourOffset = new Date().getTimezoneOffset() / 60 * -1;
  if (hourOffset > 0) {
    return `+${hourOffset}`;
  }
  if (hourOffset < 0) {
    return hourOffset.toString();
  }
  return '';
};

export const roundToTwoDecimals = (number: number): number => {
  return Math.round(number * 100) / 100;
};

export const allowAbort = (state: string): boolean => {
  return !['COMPLETED', 'FAILED', 'ABORTED'].includes(state);
};

export const validateUrl = (userInput: string): boolean => {
  let url;

  try {
    url = new URL(userInput);
  } catch (_) {
    return false;  
  }

  return url.protocol === 'https:';
};