const { Schema, model } = require('mongoose');
const MCQ = require('../Classes/mcq');

const errorMessage = null;
const questionSchema = new Schema({
  type: {
    type: String,
    required: [true, 'Required: Question Type'],
    enum: {
      values: ['mcq'],
      message: 'Invalid Question Type',
    },
  },
  body: {
    type: {},
    required: true,
    validate: {
      error: 'null',
      validator: function (body) {
        switch (this.type) {
          case 'mcq': {
            return MCQ.validate(body);
          }
        }
      },
      message: () => {
        return 'Invalid Question Body';
      },
    },
  },
});

module.exports = model('Question', questionSchema);
