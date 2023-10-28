const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//UserSignin Schema
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: String,
});

//Hash password to make it secure
userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  }
});

//Compare password
userSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error('Password is missing, can not compare!');

  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log('Error cannot compare passwords', error.message);
  }
};

//Dupe Email Check
userSchema.statics.isThisEmailInUse = async function (email) {
  if (!email) throw new Error('Invalid Email');
  try {
    const user = await this.findOne({ email });
    if (user) return false;

    return true;
  } catch (error) {
    console.log('error inside isThisEmailInUse', error.message);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);
