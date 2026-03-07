const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  currency: user.currency,
  avatar: user.avatar,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, currency } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password, currency });
    await user.setPassword(password);
    await user.save();

    return res.status(201).json({
      ...sanitizeUser(user),
      token: generateToken(user._id)
    });
  } catch (error) {
    return next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      ...sanitizeUser(user),
      token: generateToken(user._id)
    });
  } catch (error) {
    return next(error);
  }
};

exports.getMe = async (req, res) => {
  res.json(sanitizeUser(req.user));
};
