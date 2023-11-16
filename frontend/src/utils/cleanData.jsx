/**
 * @abstract stripWhitespace function is used to strip whitespace from string values in an object
 * @param {object} obj
 * @returns {object} obj
 */
// Create a function to recursively strip whitespace from string values in an object
const stripWhitespace = (obj) => {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key].trim();
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      stripWhitespace(obj[key]);
    }
  });
  return obj;
};
export default stripWhitespace;
