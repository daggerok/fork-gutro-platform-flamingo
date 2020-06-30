export const formatDateAsUTC = (date: Date): string => {
  return date.toJSON()
    .replace('T', ' ')
    .substr(0, 19);
};
