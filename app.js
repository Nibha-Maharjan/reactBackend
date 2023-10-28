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

app.get('/test', (req, res) => {
  res.send('HelloWorld');
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to backend' });
});

app.listen(3000, () => {
  console.log('port is open');
});
