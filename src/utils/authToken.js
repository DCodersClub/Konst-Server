const jwt = require('jsonwebtoken');
const { generateError } = require('.');
// eslint-disable-next-line no-undef
const SECRET = process.env.SECRETJWT;
/**
 * @param {any} value Object Or String To Encoded
 * @returns {String} token Value
 */
exports.jsonWebToken = (value) => {
  if (!value) generateError('Invalid', `Expected String Or Object, Got ${value}`);
  return jwt.sign(value, SECRET);
};

/**
 *
 * @param {String} token token string
 * @returns parsed Token Value
 */

exports.parseWebToken = (token) => {
  if (!token) generateError('Invalid', `Expected String, Got ${token}`);
  return jwt.verify(token, SECRET);
};
