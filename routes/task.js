const express = require('express');
const taskRouter = express.Router();
const taskController = require('../controller/taskController');

taskRouter.post('/api/task/', taskController.saveTask);
taskRouter.get('/api/task/', taskController.findAll);

module.exports = taskRouter;
