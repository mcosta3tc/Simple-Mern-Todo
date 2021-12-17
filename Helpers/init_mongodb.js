const mongoose = require('mongoose');
const Logger = require('./logger');

mongoose
    .connect(process.env.URI)
    .then(() => {
        Logger.debug('MongooseDb Connected');
        Logger.info('Database Connected');
    })
    .catch((err) => Logger.error(err));

mongoose.connection.on('connected', () => {
    Logger.debug('Mongoose Connected to DB');
});

mongoose.connection.on('error', (err) => {
    Logger.debug(err.message);
});

mongoose.connection.on('disconnected', () => {
    Logger.debug('Mongoose connection is disconnected');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});
