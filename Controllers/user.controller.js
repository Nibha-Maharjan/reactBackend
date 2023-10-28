const jwt = require('jsonwebtoken');
const User = require('../Models/user.model');
const sharp = require('sharp');
const cloudinary = require('../Helper/imageUpload');

exports.createUser = async (req, res) => {
  const { fullname, email, password } = req.body;
  const isNewUser = await User.isThisEmailInUse(email);
  if (!isNewUser)
    return res.json({
      success: false,
      message: 'This Email is already in use, Try Signing in',
    });
  const user = await User({
    fullname,
    email,
    password,
  });

  await user.save();
  res.json({ success: true, user });
};

exports.userSignIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.json({ success: false, message: 'User not found' });

  const isMatch = await user.comparePassword(password);

  if (!isMatch)
    return res.json({
      success: false,
      message: 'Email or Password does not match',
    });

  //JWT and cached for 1 day
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  const userInfo = {
    fullname: user.fullname,
    email: user.email,
    avatar: user.avatar ? user.avatar : '',
  };

  res.json({ success: true, user: userInfo, token });
};

exports.uploadProfile = async (req, res) => {
  const { user } = req;
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: 'Aunthorization Error' });

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${user._id}_profile`,
      width: 300,
      height: 300,
      crop: 'fill',
    });
    await User.findByIdAndUpdate(user._id, { avatar: result.url });
    res
      .status(201)
      .json({ success: true, message: 'Your profile has been set' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
    console.log('Oops, Error when uploading image', error.message);
  }
};
