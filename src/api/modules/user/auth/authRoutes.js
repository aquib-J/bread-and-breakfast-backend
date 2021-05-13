const { Router } = require('express');
const validation = require('./authValidation');
const controller = require('./authControllers');
const { PushToBody,Authenticate } = require('../../../middlewares');

const route = Router();

route.post('/signup', validation.signup, PushToBody, controller.signup);
// signs up and creates a user : email id is unique

route.post('/login', validation.login, Authenticate, PushToBody, controller.login);

// separate get method on login for the frontEnd to hit and acquire session info
// route.get('/login', validation.login, controller.returnSessionInfo);

route.get('/logout', validation.logout, Authenticate, controller.logout);

route.post('/reset-link',validation.getResetLink, controller.getResetLink);

route.post('/reset',validation.reset,controller.reset);

module.exports = route;
