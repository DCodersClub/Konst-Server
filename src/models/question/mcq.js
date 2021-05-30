const { Schema, model } = require('mongoose');
const { nanoid } = require('nanoid');
const { generateError } = require('../../utils');

const optionSchema = new Schema(
  {
    value: { type: String, required: true, trim: true, minLength: 1 },
    id: { type: String, required: true },
  },
  { _id: false }
);

const mcqScehma = new Schema({
  type: { type: String, defaultValue: 'mcq' },
  value: {
    type: String,
    required: true,
    maxLength: 300,
    minLength: 10,
  },
  options: {
    type: [optionSchema],
    required: true,
    validate: {
      validator: (value) => value.length === 4,
      message: () => `Total Option Must Be 4`,
    },
  },
  correct: { type: {}, required: true },
  quesID: {
    type: String,
    required: true,
  },
});

mcqScehma.methods = {
  _addIdToOptions: function () {
    console.log('correct' in this, typeof this.correct);
    this.options.forEach((option, i) => {
      option.id = nanoid(5);
      if (this.correct == i) {
        console.log(this.correct);
        this.correct = option;
        this.test = option;
      }
    });
  },
};

mcqScehma.pre('validate', function (next) {
  if (!Number.isInteger(parseInt(this.correct)))
    generateError('Type Error', `Expected CORRECT type number, got ${typeof this.correct}`);

  if (this.correct >= 4)
    generateError('Mismatched Value', `Expected CORRECT value 0 <= value <= ${4 - 1}`);

  this._addIdToOptions();
  this.quesID = nanoid(5);
  next();
});

module.exports = model('mcq', mcqScehma);
