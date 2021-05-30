const { Router } = require('express');
const Event = require('../models/event');
const MCQ = require('../models/question/mcq');

const throwError = (name, message) => {
  const error = new Error();
  error.name = name;
  error.message = message;
  throw error;
};

const route = Router();
class Question {
  constructor(question) {
    const { type } = question;
    if (typeof type !== 'string') throwError('Unknown Type', `Exprected string Got ${typeof type}`);
    if (!/mcq/.test(type.toLowerCase()))
      throwError('Unexpacted Value', `Exprected mcq Got ${type}`);

    const { body } = question;
    switch (type) {
      case 'mcq': {
        return new MCQ(body);
      }
    }
  }
}

route.post('/new', async (req, res, next) => {
  try {
    const questions = req.body;
    // questions.
    const event = await new Event(req.body).save();

    const question = new Question();
    res.json({ event, question });
  } catch (err) {
    next(err);
  }
});

module.exports = route;
