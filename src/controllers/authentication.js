const User = require('../models/user');
const { generateError } = require('../utils');
const { jsonWebToken, parseWebToken } = require('../utils/authToken');

exports.signup = async (req, res, next) => {
  try {
    const user = await new User(req.body).save(); // uncomment this line for production
    const token = jsonWebToken({ _id: user._id });
    res.cookie('token', token);
    return res.json({ user: { ...user.toClient(), id: user._id }, token });
  } catch (err) {
    next(err);
  }
};

exports.signin = (req, res) => {
  const { user } = req.payload;
  if (!user) return res.status(401).json({ name: 'Unauthorised', message: 'Invalid Credentials' });

  const { password } = req.body;
  if (!user.authenticate(password))
    return res.status(401).json({ name: 'Unauthorised', message: 'Invalid Credentials' });
  const token = jsonWebToken({ _id: user._id });
  res.cookie('token', token);
  return res.json({ user: { ...user.toClient(), id: user._id }, token });
};

/**
 *
 * @typedef {LoggedIn}
 * @type {Object}
 * @property {Boolean} save -- save user to payload
 */

/**
 *
 * @param {LoggedIn} option
 * @returns {MiddleWare}
 */

exports.signout = (req, res) => {
  res.cookie('token', '');
  res.send();
};

exports.isLoggedIn = (option = {}) => {
  if (typeof option !== 'object')
    generateError('TypeError', `Expected Object, Got, ${typeof option}`);
  const { save } = { save: false, ...option }; // ignore this for now, not effect entire function if this is removed

  return (req, res, next) => {
    try {
      const { user } = req.payload;
      const token = req.headers.authorization.slice('Bearer '.length);
      if (!token)
        return res.status(401).json({ name: 'Unauthorised', message: 'User Token Not Found' });
      const parsedToken = parseWebToken(token);

      if (user._id.toString() !== parsedToken._id)
        return res.status(401).json({ name: 'Unauthorised', message: 'User Not Logged In' });
      next();
    } catch (error) {
      next(error);
    }
  };
};

exports.test = (req, res) => {
  res.json(req.cookies);
};
