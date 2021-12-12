const mongoose = require('mongoose');

mongoose
    .connect(process.env.URI)
    .then(() => {
        console.log('MongooseDb Connected');
    })
    .catch((err) => console.log(err));

mongoose.connection.on('connected', () => {
    console.log('Mongoose Connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.log(err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});
