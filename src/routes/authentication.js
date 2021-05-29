const { Router } = require('express');

const { signup, signin, test } = require('../controllers/authentication');
const { validateEmail, validatePassword } = require('../middlewares/validateRequest');

const route = Router();

route.post('/signup', validateEmail(), signup);
route.post('/signin', validateEmail({ checkDB: true, save: true }), validatePassword(), signin);

route.get('/test', test);

module.exports = route;
