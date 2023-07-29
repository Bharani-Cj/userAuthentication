const userModel = require('./../Modal/userModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('./../utils/catchAsync');
const APIError = require('./../utils/APIError');
const { mailtrap } = require('../utils/nodeMailer');

const jwtSign = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.protectRoutes = catchAsync(async (req, res, next) => {
  const token = req.headers.authentication.split(' ')[1];

  if (!token) next(new APIError('Please Login again..', 401));

  const tokenObj = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

  if (!tokenObj) next(new APIError('There No token available, Please Login', 401));

  const user = await userModel.findById(tokenObj.id);

  if (!user) next(new APIError('No user Found, Please SignIn', 403));

  req.user = user;

  next();
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { userName, password } = req.body;

  if (!userName || !password) next(new APIError('Please provide email or password', 400));

  const user = await userModel.findOne({ userName });

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new APIError(' Incorrect Email or Password', 401));
  }
  const token = jwtSign(user._id);

  res.status(200).json({
    status: 'sucesses',
    token,
  });
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new APIError('Please provide a email', 400));

  const user = await userModel.findOne({ email });
  if (!user) return next(new APIError('No user Found', 404));

  const resetToken = user.createRandomToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/resetPassword/${resetToken}`;
  const userDetails = {
    to: 'bharani.cj@gmail.com',
    message: `Your reset Token ${resetURL}`,
  };
  mailtrap(userDetails);

  res.status(200).json({
    message: 'ResetToken has been sent to the registed Email',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const returnToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  if (!returnToken) return next(new APIError('no token Available.. please try another time', 402));

  const user = await userModel.findOne({
    passwordResetToken: returnToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!user) return next(new APIError('Token is no longer active. please try again', 401));

  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) return next(new APIError('please Provide with Password', 401));

  user.password = password;
  user.comparePassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  res.status(200).json({
    status: 'Please Login again',
    message: 'Password Changed Sucessfully.. ',
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const { userName, password, passwordConfirm, email, DOB } = req.body;
  if (!userName || !password || !passwordConfirm || !email || !DOB) {
    return next(new APIError('Please Provide the valid Credintials', 401));
  }
  const user = await userModel.create(req.body);

  const token = jwtSign(user._id);
  if (!token) next(new APIError('No token generated', 400));

  res.status(200).json({
    status: 'sucesses',
    token,
  });
});

exports.getAllUser = async (req, res) => {
  const data = await userModel.find();
  res.status(200).json({
    data,
  });
};
