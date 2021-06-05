const { Schema, model } = require('mongoose');
const { nanoid } = require('nanoid');
const { generateError } = require('../../utils');

const optionSchema = new Schema(
  {
    value: { type: String, required: true, trim: true, minLength: 1, maxLength: 1000 },
    id: { type: String, required: true },
  },
  { _id: false }
);

const bodySchema = new Schema(
  {
    text: { type: String, required: true, maxLength: 300, minLength: 10, trim: true },
    correct: { type: {}, required: true },
    options: {
      type: [optionSchema],
      required: true,
      validate: {
        validator: (value) => value.length === 4,
        message: () => `Total Option Must Be 4`,
      },
    },
  },
  { _id: false }
);

const mcqScehma = new Schema({
  type: {
    type: String,
    defaultValue: 'mcq',
    validate: {
      validator: (type) => /mcq/.test(type),
      message: 'Only MCQ is valid type',
    },
  },
  quesID: { type: String, required: true, unique: true },
  body: { type: bodySchema, required: true },
});

mcqScehma.methods = {
  _addIdToOptions: function () {
    const { options, correct } = this.body;
    options.forEach((option, i) => {
      option.id = nanoid(5);

      if (correct == i) this.body.correct = option;
    });
  },
};

mcqScehma.pre('validate', function (next) {
  const { correct } = this.body;
  if (!Number.isInteger(parseInt(correct)))
    generateError('Type Error', `Expected CORRECT type number, got ${typeof correct}`);

  if (correct >= 4)
    generateError('Mismatched Value', `Expected CORRECT value 0 <= value <= ${4 - 1}`);

  this._addIdToOptions();
  this.quesID = nanoid(5);
  next();
});

module.exports = model('Question', mcqScehma);
