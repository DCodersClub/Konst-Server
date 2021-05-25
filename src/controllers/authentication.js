const User = require('../models/user');
const { jsonWebToken, parseWebToken } = require('../utils/authToken');

exports.signup = async (req, res, next) => {
  try {
    const user = await new User(req.body).save();
    const token = jsonWebToken({ _id: user._id });
    res.cookie('token', token);
    return res.json({ user: user.toClient(), token });
  } catch (err) {
    next(err);
  }
};
