require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const taskRouter = require('./routes/task');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(taskRouter);

const start = async () => {
    try {
        await mongoose.connect(process.env.db_uri);
        console.log('DB Connected');
        app.listen(port, () => {
            console.log(`Listen on : ${port}`);
        });
    } catch (e) {
        console.log(e);
    }
};

start();
