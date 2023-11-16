/**
 * @abstract computeRating function is used to compute the rating
 * @param {string} reviews
 * @returns {number} totalRating
 * @author Jason
 * @version 1.0.0
 */
const computeRating = (reviews) => {
  if (reviews.length === 0) {
    return 0;
  } else {
    const totalRating = reviews.reduce((acc, cur) => acc + cur.rating, 0);
    return totalRating / reviews.length;
  }
};

export default computeRating;
