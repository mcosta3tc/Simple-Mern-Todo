const Redis = require('ioredis');
const Logger = require('./logger');

const client = new Redis(process.env.REDISCLOUD_URL);

client.on('connect', () => {
    Logger.debug('Client connected to redis...');
});

client.on('ready', () => {
    Logger.debug('Client connected to redis and ready to use...');
    Logger.info('Client ready to use');
});

client.on('error', (err) => {
    Logger.debug(err.message);
});

client.on('end', () => {
    Logger.debug('Client disconnected from redis');
});

process.on('SIGINT', () => {
    client.quit();
});

module.exports = client;
