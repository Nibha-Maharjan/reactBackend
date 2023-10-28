const { check, validationResult } = require('express-validator');

//Validation
exports.validateUserSignup = [
  check('fullname')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name cannot be empty')
    .isString()
    .withMessage('Input a valid name')
    .isLength({ min: 3, max: 21 })
    .withMessage('Name length is set between 3 to 21 Characters long'),
  check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Please enter a valid Email'),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 3, max: 21 })
    .withMessage('Secure Password should be between 3 to 21 Characters long'),
  check('confirmPassword')
    .trim()
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password not matching');
      }
      return true;
    }),
];

exports.userValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ success: false, message: error });
};

exports.validateUserSignIn = [
  check('email').trim().isEmail().withMessage('Email is Required'),
  check('password').trim().not().isEmpty().withMessage('Password is Required'),
];
