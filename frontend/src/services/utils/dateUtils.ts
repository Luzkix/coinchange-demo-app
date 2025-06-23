/**
 * Converts OffsetDateTime in string format into specifically formated string (e.g. 23-06-2025 20:58:00)
 * @param isoString - string OffsetDateTime, e.g. "2025-06-23T20:58:00.000+02:00"
 * @returns formated date time, e.g. "23-06-2025 20:58:00"
 */
export const convertOffsetDateTimeToFormatedString = (isoString: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};
