const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const { successLog, link } = require('./utils/logs');
const User = require('./models/user');

const { PORT } = process.env;

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
