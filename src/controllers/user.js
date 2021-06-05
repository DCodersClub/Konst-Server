const Event = require('../models/event');
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

exports.sendUserData = async (req, res) => {
  const { user } = req.payload;
  const events = await Event.find({ 'participants.user': user._id });
  res.json({ ...user.toClient(), events: events.map(({ name, eventId }) => ({ name, eventId })) });
};
