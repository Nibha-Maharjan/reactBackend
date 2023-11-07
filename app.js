const express = require('express');
require('dotenv').config();
require('./Models/db.model');
const userRouter = require('./Routes/user.routes');

const User = require('./Models/user.model');

const app = express();

//Express Middleware func
app.use(express.json());

app.use(userRouter);

const test = async (email, password) => {
  const user = await User.findOne({ email: email });
  const result = await user.comparePassword(password);
};

test('test1@gmail.com', 'pokemon1');

//Getting Patient.route
const PatientRoute = require('./Routes/patient.route');
app.use('/patient', PatientRoute);

// //404 Error
// app.use((req, res, next) => {
//   const err = new Error('Not found');
//   err.status = 404;
//   next(err);
// });

//Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to backend' });
});

app.listen(3000, () => {
  console.log('port is open');
});
