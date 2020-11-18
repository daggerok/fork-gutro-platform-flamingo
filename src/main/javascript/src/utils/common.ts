
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

export const formatDateTimeWithWords = (date: Date): string => {
  const datePart = formatDateWithWords(date);
  const timePart = date.toTimeString().substr(0, 5);

  return `${datePart} ${timePart}`;
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
