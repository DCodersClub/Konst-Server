const { Router } = require('express');
const Event = require('../models/event');
const { generateError } = require('../utils');

const route = Router();

route.post('/new', async (req, res, next) => {
  try {
    const event = await new Event(req.body).save();
    res.json(event);
  } catch (err) {
    next(err);
  }
});

module.exports = route;
