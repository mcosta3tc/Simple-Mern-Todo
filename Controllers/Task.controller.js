const taskModel = require('../Models/Task.model');
const Logger = require('../Helpers/logger');

const taskController = {};

taskController.saveTask = async (req, res) => {
    const userId = req.payload.aud;
    const { title, category, active } = req.body;
    const createdTask = new taskModel({ title, category, active, author: userId });
    try {
        await createdTask.save();
        Logger.debug(`controller/taskController : saveTask() { createdTask : ${createdTask} }`);
        return res.sendStatus(201);
    } catch (e) {
        res.status(500).json({
            error: 'Creation error',
        });
    }
};

taskController.findAll = async (req, res) => {
    const userId = req.payload.aud;
    console.log(userId);
    Logger.debug('user', req.locals);
    try {
        const tasks = await taskModel.find({ author: userId });
        Logger.debug(`controller/taskController : findAll() { tasks : ${tasks} }`);
        res.send(tasks);
    } catch (e) {
        res.status(500).json({
            error: e,
        });
    }
};

taskController.deleteTask = async (req, res) => {
    const id = req.params.id;
    try {
        await taskModel.findByIdAndDelete(id);
        Logger.debug(`controller/taskController : deleteTask() { task.id : ${id} deleted }`);
        res.sendStatus(200);
    } catch (e) {
        res.status(500).json({
            error: 'Internal server error',
        });
    }
};

module.exports = taskController;
