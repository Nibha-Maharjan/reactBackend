const mongoose = require('mongoose');

//Connect DB via Dotenv
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database Connection is successful');
  })
  .catch((err) => console.log(err.message));
