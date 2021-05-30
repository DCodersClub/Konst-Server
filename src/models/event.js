const { Schema, model, Types } = require('mongoose');
const { customAlphabet } = require('nanoid');
const mcqquestion = require('./question/mcq');

const participants = new Schema({
  user: { type: Types.ObjectId, ref: 'User' },
  questionSolved: { type: Number, default: 0 },
  questionCorrect: { type: Number, default: 0 },
});

const time = new Schema(
  {
    start: { type: Number, required: true },
    end: { type: Number, required: true },
  },
  { _id: false }
);

const eventSchema = new Schema(
  {
    name: { type: String, required: true, minLength: 3, maxLength: 150, trim: true },
    description: { type: String, default: '', maxLength: 2000 },

    eventId: { type: String, unique: true },

    _registration: {
      type: time,
      required: true,
    },

    _schedule: {
      type: time,
      required: true,
    },
    questions: [],
    participants: [participants],
  },
  { timestamps: true }
);

eventSchema.pre('validate', function (next) {
  this.eventId = customAlphabet(this.name, 10)();
  next();
});

const toTimeNumber = (timeString) => new Date(timeString).getTime();
eventSchema
  .virtual('registration')
  .set(function (registration) {
    const { start, end } = registration;
    this._registration = { start: toTimeNumber(start), end: toTimeNumber(end) };
  })
  .get(function () {
    const { start, end } = this._registration;
    return { start, end };
  });

eventSchema
  .virtual('schedule')
  .set(function (schedule) {
    const { start, end } = schedule;
    this._schedule = { start: toTimeNumber(start), end: toTimeNumber(end) };
  })
  .get(function () {
    const { start, end } = this._schedule;
    return { start, end };
  });

eventSchema.virtual('type').set(function (type) {
  if (typeof type !== 'string') throw new Error(`Expected string, got ${typeof type}`);
  this._type = type;
});

module.exports = model('Events', eventSchema);
