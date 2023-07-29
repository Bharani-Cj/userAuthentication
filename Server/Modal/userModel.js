const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'Name must be required'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Field must have Email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please Provide the Valid Email'],
  },
  DOB: {
    type: Date,
    required: [true, 'Date-of-birth is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required field'],
    minlength: [8, 'Password MUST contain atleast 8 character'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'CONFIRM is required field'],
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: "Password Does'nt match",
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'Publisher'],
    default: 'Publisher',
  },
  dateCreated: {
    type: String,
    default: new Date().toLocaleDateString(),
  },
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.comparePassword = async function (userPassword, hashedPassword) {
  return await bcrypt.compare(userPassword, hashedPassword);
};

userSchema.methods.createRandomToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return token;
};

const userModel = mongoose.model('userData', userSchema);
module.exports = userModel;
