const { generateError } = require('../utils');

/**
 * @typedef QuestionType
 * @type {Object}
 * @property {String} type type of a question
 * @property {Object} body body of a question
 */

class Question {
  /**
   * @param {QuestionType} question
   */
  constructor(question) {
    const { type } = question;
    if (typeof type !== 'string')
      generateError('Unknown Type', `Exprected string Got ${typeof type}`);
    if (!/mcq/.test(type.toLowerCase()))
      generateError('Unexpacted Value', `Exprected mcq Got ${type}`);

    const { body } = question;
    switch (type) {
      //todo
      case 'mcq': {
        console.log('TODO');
      }
    }
  }
}

module.exports = Question;
