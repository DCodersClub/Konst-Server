const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRETJWT;
/**
 *
 * @param {any} value Object Or String To Encoded
 * @returns {String} token Value
 */
exports.jsonWebToken = (value) => {
  if (!value) throw new Error(`Expected Other Null Or Undefined, Got ${value}`);
  return jwt.sign(value, SECRET);
};

/**
 *
 * @param {String} token token string
 * @returns parsed Token Value
 */

exports.parseWebToken = (token) => {
  if (!token) throw new Error(`Expected Other Null Or Undefined, Got ${value}`);
  return jwt.verify(token, SECRET);
};
