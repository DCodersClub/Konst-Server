const { Router } = require('express');

const {
  getEventById,
  createEvent,
  addParticipantToEvent,
  getEventData,
} = require('../controllers/events');
const { getUserById } = require('../controllers/user');

const route = Router();

route.param('eventId', getEventById);
route.param('userId', getUserById);

route.post('/new', createEvent);
route.post('/:eventId/register/:userId', addParticipantToEvent);
route.get('/:eventId', getEventData);

module.exports = route;
