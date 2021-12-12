const express = require('express');
const taskRouter = express.Router();
const taskController = require('../Controllers/Task.controller');

taskRouter.post('/api/task/', taskController.saveTask);
taskRouter.get('/api/task/', taskController.findAll);
taskRouter.delete('/api/task/:id', taskController.deleteTask);

module.exports = taskRouter;
