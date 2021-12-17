const express = require('express');
const taskRouter = express.Router();
const taskController = require('../Controllers/Task.controller');
const { verifyAccessToken } = require('../Helpers/jwt_helper');

taskRouter.post('/api/task/', verifyAccessToken, taskController.saveTask);
taskRouter.get('/api/task/', taskController.findAll);
taskRouter.delete('/api/task/:id', taskController.deleteTask);

module.exports = taskRouter;
