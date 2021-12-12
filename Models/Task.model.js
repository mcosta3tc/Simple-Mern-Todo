const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    category: { default: null, type: String },
    active: { default: true, type: Boolean },
});

const taskModel = mongoose.model('Task', taskSchema);

module.exports = taskModel;
