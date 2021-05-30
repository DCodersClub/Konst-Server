const { isEmail } = require('validator');

const addToPayload = require('../utils/addToPayload');
const User = require('../models/user');

/**
 * @typedef options
 * @type {Object}
 * @property {Body|Params|Cookies|Headers} checkIn - Req Object In Which To Check
 * @property {String} name - Name Of Email Field
 * @property {Boolean} save - [ Default: false ] save User Data Into req.payload
 * @property {Boolean} checkDB - [ Default: false ] checks email into database
 * @property {Boolean} forwardError -[ Default: true ] If There Is A Error Passed It To Check Middleware
 */

/**
 *
 * @param {String} fieldName -- check whether req.[fieldName] is body, cookies, params, query, headers
 * @returns {Boolean}
 */
const validateCheckInField = (value) => {
  const validCheckFieldRegex = /body|headers|cookies|params|query/;
  return validCheckFieldRegex.test(value);
};

/**
 * Validate Email
 * @param {options} option
 * @returns
 */

exports.validateEmail = (option) => {
  const config = {
    checkIn: 'body',
    name: 'email',
    save: false,
    checkDB: false,
    forwardError: false,
    required: false,
    ...option,
  };
  const { save, checkDB, forwardError, checkIn, name, required } = config;

  // Validate CHECK field in config
  if (!validateCheckInField(checkIn))
    throw new Error(`Check Must In One Of These body|headers|cookies|params|query, GOT ${checkIn}`);

  // Validate Option Property
  const checkIsBoolean = () =>
    [checkDB, save, forwardError].every((val) => typeof val === 'boolean');
  if (!checkIsBoolean()) throw new Error('One Of Option Property Is Not Boolean');

  // return middleWare
  return async (req, res, next) => {
    const email = req[checkIn][name];

    if (!email)
      return res.status(404).json({ name: 'Invalid Request', message: `${name} Required` });

    if (!isEmail(email))
      return res
        .status(400)
        .json({ name: 'Invalid Email', message: `${email} is not valid email` });

    if (!checkDB) return next(); //

    // check in Database if Email Already Exist
    try {
      const user = await User.findOne({ email });
      //if not found user can be null
      if (save) addToPayload(req, { user });
      next();
    } catch (e) {
      next(e);
    }
  };
};

// ------------------------------------------------------------------------------------------

/**
 * @typedef ValidatePasswordOptions
 * @type {Object}
 * @property {String} checkIn Req Object In Which To Check i.e body, query
 *
 */

/**
 *
 * @param {ValidatePasswordOptions} option  config for validating password
 * @return {Middeware} MiddleWare Funtion
 */

exports.validatePassword = (option = {}) => {
  if (typeof option !== 'object') throw new Error(`Config Must Be Object, GOT: ${typeof option}`);
  const { checkIn } = { checkIn: 'body', ...option };

  if (!validateCheckInField(checkIn))
    throw new Error(`Check Must In One Of These body|headers|cookies|params|query, GOT ${checkIn}`);

  return (req, res, next) => {
    const { password } = req[checkIn];
    if (!password)
      return res
        .status(400)
        .json({ name: 'Invalid Request', message: 'Expected (email & password) in request' });

    next();
  };
};
