const { isEmail } = require('validator');

const addToPayload = require('../utils/addToPayload');
const User = require('../models/user');

/**
 * @typedef options
 * @type {Object}
 * @property {Body|Params|Cookies|Headers} check - Req Object In Which To Check
 * @property {String} name - Name Of Email Field
 * @property {Boolean} save - [ Default: false ] save User Data Into req.payload
 * @property {Boolean} checkDB - [ Default: false ] checks email into database
 * @property {Boolean} forwardError -[ Default: true ] If There Is A Error Passed It To Check Middleware
 */

const validCheckFields = ['body', 'headers', 'cookies', 'params', 'query'];

/**
 * Validate Email
 * @param {options} option
 * @returns
 */

exports.validateEmail = (option) => {
  const config = {
    check: 'body',
    name: 'email',
    save: false,
    checkDB: false,
    forwardError: false,
    ...option,
  };
  const { save, checkDB, forwardError, check, name } = config;

  // Validate CHECK field
  if (!validCheckFields.includes(check))
    throw new Error(`Check Must In One Of These ${validCheckFields.join(' | ')}`);

  // Validate Option Property
  const checkIsBoolean = () =>
    [checkDB, save, forwardError].every((val) => typeof val === 'boolean');
  if (!checkIsBoolean()) throw new Error('One Of Option Property Is Not Boolean');

  // return middleWare
  return async (req, res, next) => {
    const email = req[check][name];
    if (!isEmail(email))
      return res
        .status(400)
        .json({ name: 'Invalid Email', message: `${email} is not valid email` });

    // check in Database if Email Already Exist
    if (!checkDB) return next();
    try {
      const user = await User.findOne({ email });
      console.log(user);
      if (save) addToPayload(req, { user });
      next();
    } catch (e) {
      next(e);
    }
  };
};
