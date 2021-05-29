const { Router } = require('express');
const { isLoggedIn } = require('../controllers/authentication');
const { getUserById, sendUserData } = require('../controllers/user');
const { parseWebToken } = require('../utils/authToken');

const route = Router();

route.param('userid', getUserById);

route.get('/:userid', isLoggedIn(), sendUserData);

module.exports = route;
