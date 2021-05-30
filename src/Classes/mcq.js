const { generateError } = require('../utils');

/**
 * @typedef QuestionBody
 * @type {Object}
 * @property {String} text Question Text Or Value
 * @property {Array} options Must Be Array Containing ({value: OPTION_NAME}) object
 * @property {Number} correct Index Position Of Correct Option
 */

class MCQ {
  /**
   * @param {QuestionBody} body
   */
  constructor(body) {
    MCQ.validate(body);
  }

  /**
   * @param {QuestionBody} body
   * @returns {Boolean}
   */

  static validate(body) {
    if (typeof body !== 'object')
      generateError('Type Error', `Expected Question Body To Object, got ${typeof body}`);

    const { text, options, correct } = body;

    if (!text || !options || correct === undefined)
      generateError(
        'Unexpected Keys',
        `Property Or Undefined, got ${Object.keys(body).join(' | ')}`
      );

    textValidate(body.text);
    validateOptions(options);
    validateCorrect(options.length, body);

    return true;
  }
}
/**
 *
 * @param {String} text
 */
const textValidate = (text) => {
  if (typeof text !== 'string')
    generateError('Type Error', `Expection Question Test String, got ${typeof text}`);
};

const validateOptions = (options) => {
  if (!Array.isArray(options)) generateError('Type Error', 'MCQ Option Must Be Array');
  // sanitizing options
  options.forEach((option) =>
    Object.keys(option).forEach((key) => {
      if (!/value/.test(key)) option[key] = undefined;
    })
  );
};
/**
 * @param {*} len length of options array
 * @param {Number} correct Index Of Correct Option
 */
const validateCorrect = (len, body) => {
  const { correct } = body;
  if (!Number.isInteger(parseInt(correct)))
    generateError('Type Error', `Expected CORRECT type number, got ${typeof correct}`);

  if (len >= 4) generateError('Mismatched Value', `Expected CORRECT value 0 <= value <= ${4 - 1}`);

  // sanitize
  if (typeof correct === 'string') body.correct = parseInt(correct);
};

module.exports = MCQ;
