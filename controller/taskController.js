const taskModel = require("../model/task");

const taskController = {};

taskController.saveTask = async (req, res) => {
    const { title } = req.body;
    const createdTask = new taskModel(title);
    try {
        await createdTask.save();
        console.log("Task Added");
        return res.sendStatus(200).send(createdTask);
    } catch (e) {
        return console.log(e);
    }
};

taskController.findAll = async (req, res) => {
    try {
        const tasks = await taskModel.find();
        console.log(tasks);
        res.send(tasks);
    } catch (e) {
        console.log(e);
    }
};

module.exports = taskController;
