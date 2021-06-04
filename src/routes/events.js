const { Router } = require('express');
const { events } = require('../models/event');
const Event = require('../models/event');
const User = require('../models/user');
const { generateError } = require('../utils');

const route = Router();

route.post('/new', async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event.toClient());
  } catch (err) {
    next(err);
  }
});

route.post('/:eventId/register/:userId', async (req, res, next) => {
  const { eventId, userId } = req.params;
  try {
    const event = await Event.findByEventId(eventId);
    const user = await User.findById(userId);
    event.participants.push({ user: user._id });
    await event.save();
    res.json({ event });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

route.get('/:eventId', async (req, res, next) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findByEventId(eventId);
    await event.populate('participants.user').execPopulate();

    const participants = event.participants.map((data) => {
      const user = data.user.toClient();
      return { ...data.toJSON(), user };
    });

    res.json({ ...event.toClient(), participants });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = route;
