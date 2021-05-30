const User = require('../models/user');
const addToPayload = require('../utils/addToPayload');

exports.getUserById = async (req, res, next, id) => {
  try {
    const user = await User.findUserById(id);
    addToPayload(req, { user });
    next();
  } catch (e) {
    next(e);
  }
};

exports.sendUserData = (req, res) => {
  const { user } = req.payload;
  res.json(user.toClient());
};
