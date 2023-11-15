/**
 * @param {str} startDate
 * @param {str} endDate
 * @returns {number} diffInDays
 */
export const countDays = (startDate, endDate) => {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the difference in milliseconds
  const diffInTime = end.getTime() - start.getTime();

  // Convert the difference in milliseconds to days
  const diffInDays = Math.round(diffInTime / oneDay);

  return diffInDays;
}
