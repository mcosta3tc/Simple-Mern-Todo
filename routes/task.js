const express = require("express");
const taskRouter = express.Router();
const taskModel = require("../model/task");

taskRouter.post("/api/task/", async (req, res) => {
    const { title } = req.body;
    const createdTask = new taskModel(title);
    try {
        await createdTask.save();
        console.log("Task Added");
        res.sendStatus(200).send(createdTask);
    } catch (e) {
        console.log(e);
    }
});

module.exports = taskRouter;
