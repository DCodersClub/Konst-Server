const { Router } = require('express');
const Event = require('../models/event');
const { generateError } = require('../utils');
const Question = require('../models/question');

const route = Router();

route.post('/new', async (req, res, next) => {
  try {
    // const event = await new Event(req.body).save();
    const ques = req.body.questions[0];
    const question = new Question(ques);
    // question.save();
    question.validate();

    res.json(question.body);
  } catch (err) {
    next(err);
  }
});

module.exports = route;
