const Event = require('../models/event');
const MCQ = require('../models/question/mcq');

const { generateError } = require('../utils');
const addToPayload = require('../utils/addToPayload');

exports.getEventById = async (req, res, next, id) => {
  const event = await Event.findByEventId(id);
  if (!event) generateError('Invalid EventId', 'Event With That ID Not Exist');
  addToPayload(req, { event });
  next();
};

exports.createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event.toClient());
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.addParticipantToEvent = async (req, res, next) => {
  try {
    const { user, event } = req.payload;

    const inserted = event.addParticipant(user);
    if (!inserted) generateError('409', 'User Already Participated');
    await event.save();
    res.status(201).json({ event: event.toClient() });
  } catch (e) {
    next(e);
  }
};

const populateParticipant = async (event) => {
  await event.populate('participants.user').execPopulate();
  return event.participants.map((data) => ({
    ...data.toJSON(),
    user: data.user.toClient(),
  }));
};
const populateQuestion = async (event) => {
  await event.populate('questions.question').execPopulate();
  return event.questions.map(({ question }) => ({
    type: question.type,
    id: question.quesID,
    body: question.body,
  }));
};

const toBool = (val) => (val ? (val.trim().toLowerCase() === 'false' ? false : true) : false);

exports.getEventData = async (req, res, next) => {
  try {
    const { event } = req.payload;
    let { participants: insertParticipants, questions: insertQuestion } = req.query;
    insertParticipants = toBool(insertParticipants);
    insertQuestion = toBool(insertQuestion);

    const participants = insertParticipants ? await populateParticipant(event) : undefined;
    const questions = insertQuestion ? await populateQuestion(event) : undefined;

    res.json({ ...event.toClient(), participants, questions });
  } catch (e) {
    next(e);
  }
};

exports.addQuestionToEvent = async (req, res, next) => {
  try {
    const { event } = req.payload;
    const question = await MCQ.create(req.body);
    event.addQuestion(question);
    await event.save();
    res.status(201).json({ ...event.toClient() });
  } catch (e) {
    next(e);
  }
};
