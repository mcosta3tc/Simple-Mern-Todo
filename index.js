require('dotenv').config();
require('./helpers/init_mongodb');
require('./helpers/init_redis');

const express = require('express');
const cors = require('cors');
const createError = require('http-errors');

const taskRouter = require('./Routes/Task.route');
const authRouter = require('./Routes/Auth.route');

const { verifyAccessToken } = require('./helpers/jwt_helper');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/protected', verifyAccessToken, async (req, res, next) => {
    res.send('hello form protected');
});

app.use(taskRouter);
app.use('/auth', authRouter);

app.use(async (req, res, next) => {
    next(createError.NotFound());
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    });
    next();
});

app.listen(port, () => {
    console.log(`Listen on : ${port}`);
});
