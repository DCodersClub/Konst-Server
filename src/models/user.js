const { Schema, model } = require('mongoose');
const { createHmac } = require('crypto');
const { v1: uudiV4 } = require('uuid');

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      min: 3,
      max: 100,
      required: [true, 'firstName Required'],
      trim: true,
    },
    lastName: { type: String, min: 3, max: 100, required: true, trim: true },
    encryptPassword: { type: String, required: true },
    salt: String,
    email: {
      type: String,
      lowercase: true,
      required: [true, 'email Required'],
      unique: true,
      validate: {
        validator: (value) => emailRegex.test(value),
        message: ({ value }) => `${value} is not a valid email`,
      },
    },
  },
  { timestamps: true }
);

UserSchema.methods = {
  securePassword: function (simplePassword) {
    if (!simplePassword) throw new Error('Parameters Not Passed');
    const encryptPassword = createHmac('sha256', this.salt).update(simplePassword).digest('hex');
    return encryptPassword;
  },

  authenticate: function (simplePassword) {
    return this.securePassword(simplePassword) === this.encryptPassword;
  },
};

UserSchema.virtual('password').set(function (password) {
  this.salt = uudiV4();
  this.encryptPassword = this.securePassword(password);
});

module.exports = model('User', UserSchema);
