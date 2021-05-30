const { generateError } = require('.');
/**
 * Add data to req.payload
 * @param {Object} req - Request Object
 * @param {object} data - Data Object
 * @returns {Void}
 */

module.exports = (req, data = {}) => {
  if (typeof req !== 'object' || typeof data !== 'object')
    generateError('Type Error', 'MisMatched Type: Passed Parameters Must Be Objects');
  if (!req.payload) req.payload = { ...data };
  else req.payload = { ...req.payload, ...data };
};
