const { Schema, model, isValidObjectId } = require('mongoose');
const { createHmac } = require('crypto');
const { v1: uudiV4 } = require('uuid');

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      minLength: [3, 'Name Is Quite Small'],
      maxLength: [100, 'Too Large'],
      required: [true, 'firstName Required'],
      trim: true,
    },
    lastName: { type: String, min: 3, max: 100, required: true, trim: true },
    encryptPassword: { type: String, required: true },
    salt: String,
    type: { type: String, enum: ['user', 'admin'], default: 'user' },
    email: {
      type: String,
      lowercase: true,
      required: [true, 'email Required'],
      unique: [true, 'Email Already Exists'],
      validate: {
        validator: (value) => emailRegex.test(value),
        message: ({ value }) => `${value} is not a valid email`,
      },
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.statics = {
  findUserByEmail: async function (email) {
    if (!email) throw new Error(`Email Expected Got, ${email}`);
    const user = await this.findOne({ email });

    return user;
  },

  findUserById: async function (id) {
    const a = new Error();
    if (!isValidObjectId(id)) throw new Error('Not Valid UserId');
    if (!id) throw new Error(`Email Expected Got, ${id}`);
    const user = await this.findById(id);

    return user;
  },
};

UserSchema.methods = {
  securePassword: function (simplePassword) {
    if (!simplePassword) throw new Error('Parameters Not Passed');
    const encryptPassword = createHmac('sha256', this.salt).update(simplePassword).digest('hex');
    return encryptPassword;
  },

  authenticate: function (simplePassword) {
    return this.securePassword(simplePassword) === this.encryptPassword;
  },

  // removes few proper before sending to client user property for
  toClient: function () {
    const user = this;
    return {
      name: {
        first: user.firstName,
        last: user.lastName,
      },
      varified: user.isVerified,
      type: user.type === 'admin' && user.type,
      email: user.email,
    };
  },
};

UserSchema.virtual('password').set(function (password) {
  this.salt = uudiV4();
  this.encryptPassword = this.securePassword(password);
});

module.exports = model('User', UserSchema);
