const { Schema, model, Types } = require('mongoose');
const { nanoid } = require('nanoid');
const { generateError } = require('../utils');

const participants = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User' },
    questionSolved: { type: Number, default: 0 },
    questionCorrect: { type: Number, default: 0 },
  },
  { _id: false }
);

participants.methods = {
  toClient: function () {
    const user = this.user.toClient();

    return { ...this.toJSON(), user };
  },
};

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
  if (!this.eventId) this.eventId = nanoid(7);
  next();
});

eventSchema.methods = {
  toClient: function () {
    const event = this;

    return {
      name: event.name,
      description: event.description,
      eventId: event.eventId,
      registration: event.registration,
      schedule: event.schedule,
      participantCount: event.participants.length,
    };
  },
};

eventSchema.statics = {
  /**
   * Finds Event Id
   * @param {String} eventId Event Id
   * @returns {Null|Event}
   */
  findByEventId: async function (eventId) {
    const event = this.findOne({ eventId });
    return event;
  },
};

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
  if (typeof type !== 'string')
    generateError('Invalid Type', `Expected string, got ${typeof type}`);
  this._type = type;
});

const Event = model('Events', eventSchema);
module.exports = Event;
