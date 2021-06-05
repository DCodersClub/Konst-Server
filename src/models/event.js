const { Schema, model, Types } = require('mongoose');
const { nanoid } = require('nanoid');

const subdoucmentConfig = { _id: false };
const userData = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User' },
    questionSolved: { type: Number, default: 0 },
    questionCorrect: { type: Number, default: 0 },
  },
  subdoucmentConfig
);

const question = new Schema(
  {
    question: { type: Types.ObjectId, ref: 'Question' },
  },
  subdoucmentConfig
);

const time = new Schema(
  {
    start: { type: Number, required: true },
    end: { type: Number, required: true },
  },
  subdoucmentConfig
);

const eventSchema = new Schema(
  {
    name: { type: String, required: true, minLength: 3, maxLength: 150, trim: true },
    description: { type: String, default: '', maxLength: 2000 },
    eventId: { type: String, unique: true },
    _registration: { type: time, required: true },
    _schedule: { type: time, required: true },
    participants: { type: [userData], unique: true },
    questions: { type: [question] },
  },
  { timestamps: true }
);

eventSchema.statics = {
  findByEventId: async function (eventId) {
    const event = this.findOne({ eventId });
    return event;
  },
};

eventSchema.methods = {
  toClient: function () {
    const { name, description, eventId, registration, schedule } = this;
    return { name, description, eventId, registration, schedule };
  },

  addParticipant: function (user) {
    const found = !!this.participants.find((participant) => participant.user == user.id);
    if (found) return false; // not inserted
    this.participants.push({ user });
    return true;
  },

  addQuestion: function (question) {
    this.questions.push({ question });
    return true;
  },
};

eventSchema.pre('validate', function (next) {
  if (!this.eventId) this.eventId = nanoid(7);
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

const Event = model('Events', eventSchema);
module.exports = Event;
