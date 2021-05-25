const { Router } = require('express');

const { signup } = require('../controllers/authentication');
const { validateEmail } = require('../middlewares/validateRequest');

const route = Router();

route.post('/signup', validateEmail(), signup);

route.get('/signup', (req, res, next) => {
  res.send('Hii');
});

module.exports = route;
