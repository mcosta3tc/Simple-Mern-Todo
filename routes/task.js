const express = require('express');
const taskRouter = express.Router()

taskRouter.post("/api/task/", async (req, res)=> {
    console.log(req.body);
    res.sendStatus(200).end();
})

module.exports = taskRouter;
