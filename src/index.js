const { connect } = require('mongoose');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');

const { successLog, link, errorLog } = require('./utils/logs');
const User = require('./models/user');

const { PORT, DB_URL } = process.env;

// DB Connection
connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
  .then(() => successLog('Database Connected'))
  .catch((reason) => errorLog(reason));

//Express
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes

const user = new User({
  firstName: 'Harsh',
  lastName: 'Rastogi',
  password: 'be18cs044',
  email: 'rastogiharsh04@gmail.com',
});
user.validate();

// Server Start
app.listen(PORT || 8000, () => {
  const urlLink = link(`http://localhost:${PORT}`);
  successLog(`Serving Setup And Running On ${urlLink}`);
});
