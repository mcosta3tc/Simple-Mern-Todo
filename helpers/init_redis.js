const Redis = require('ioredis');

const client = new Redis(process.env.REDISCLOUD_URL);

client.on('connect', () => {
    console.log('Client connected to redis...');
});

client.on('ready', () => {
    console.log('Client connected to redis and ready to use...');
});

client.on('error', (err) => {
    console.log(err.message);
});

client.on('end', () => {
    console.log('Client disconnected from redis');
});

process.on('SIGINT', () => {
    client.quit();
});

module.exports = client;
