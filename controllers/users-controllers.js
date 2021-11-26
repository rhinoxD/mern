const uuid = require('uuid').v4;
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Ben Dover',
    email: 'test@test.com',
    password: 'testers',
  },
];

exports.getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { name, email, password, places } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again.', 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError(
      'User already exists, please login instead.',
      422
    );
    return next(error);
  }
  const createdUser = new User({
    name,
    email,
    image:
      'https://exploringbits.com/wp-content/uploads/2021/11/anime-girl-pfp-2.jpg?ezimgfmt=rs:352x380/rscb3/ng:webp/ngcb3',
    password,
    places,
  });
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signing Up failed, please try again.', 500);
    return next(error);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Logging in failed, please try again.', 500);
    return next(error);
  }
  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }
  res.json({ message: 'LOGGED IN!' });
};
