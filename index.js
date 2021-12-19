require('dotenv').config();
require('./Helpers/init_mongodb');
require('./Helpers/init_redis');

const express = require('express');
const cors = require('cors');
const createError = require('http-errors');
const Logger = require('./Helpers/logger');

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

const taskRouter = require('./Routes/Task.route');
const authRouter = require('./Routes/Auth.route');
app.use(taskRouter);
app.use('/auth', authRouter);

app.use(async (req, res, next) => {
    next(createError.NotFound());
});
app.use((err, req, res, next) => {
    Logger.error(err);
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
    Logger.debug(`Server is up and running @ http://localhosts:${port}`);
    Logger.info('Server is up and running');
});
