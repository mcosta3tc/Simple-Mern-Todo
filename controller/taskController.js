const taskModel = require('../model/task');

const taskController = {};

taskController.saveTask = async (req, res) => {
    const { title, category, active } = req.body;
    const createdTask = new taskModel({ title, category, active });
    try {
        await createdTask.save();
        return res.sendStatus(201);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: 'Creation error',
        });
    }
};

taskController.findAll = async (req, res) => {
    try {
        const tasks = await taskModel.find();
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
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: 'Internal server error',
        });
    }
};

module.exports = taskController;
