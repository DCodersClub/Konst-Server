const { connect } = require('mongoose');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { successLog, link, errorLog } = require('./utils/logs');
const authRoutes = require('./routes/authentication');
const userRoutes = require('./routes/user');
const eventRoutes = require('./routes/events');
const { errorHandler } = require('./middlewares/errorHandler');

// eslint-disable-next-line no-undef
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
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/event', eventRoutes);

app.use(errorHandler);
// Server Start
app.listen(PORT || 8000, () => {
  const urlLink = link(`http://localhost:${PORT}`);
  successLog(`Serving Setup And Running On ${urlLink}`);
});
