require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const mongoose = require('mongoose');
const taskRouter = require('./routes/task');
const cors = require('cors');

app.use(
    cors({
        origin: process.env.ORIGIN,
    })
);
app.use(express.json());
app.use(taskRouter);

const start = async () => {
    try {
        await mongoose.connect(process.env.URI);
        console.log('DB Connected');
        app.listen(port, () => {
            console.log(`Listen on : ${port}`);
        });
    } catch (e) {
        console.log(e);
    }
};

start();
