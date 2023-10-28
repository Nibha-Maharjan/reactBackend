const express = require('express');

const router = express.Router();
const {
  createUser,
  userSignIn,
  uploadProfile,
} = require('../Controllers/user.controller');
const {
  validateUserSignup,
  userValidation,
  validateUserSignIn,
} = require('../Middleware/Validation/user.validation');
const { isAuth } = require('../Middleware/auth.middleware');
const multer = require('multer');

const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Invalid Image file', false);
  }
};
const uploads = multer({ storage, fileFilter });

router.post('/create-user', validateUserSignup, userValidation, createUser);
router.post('/sign-in', validateUserSignIn, userValidation, userSignIn);
router.post(
  '/upload-profile',
  isAuth,
  uploads.single('profile'),
  uploadProfile
);

// router.post('/create-patient', isAuth, (req, res) => {
//   //create post
//   res.send('Welcome you are in Secret Route');
// });

module.exports = router;
