const express = require('express');
const taskRouter = express.Router();
const taskModel = require('../model/task');

taskRouter.post("/api/task/", async (req, res)=> {
    const {title} = req.body;
    let createdTask = new taskModel({title});
    await createdTask.save();
})

module.exports = taskRouter;
