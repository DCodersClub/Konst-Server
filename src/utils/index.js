/**
 *
 * @param {String} name Name Of Error
 * @param {String} message Message Related To Error
 */
exports.generateError = (name, message) => {
  const error = new Error();

  error.name = name;
  error.message = message;

  throw error;
};
