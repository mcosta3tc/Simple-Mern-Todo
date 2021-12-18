const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const client = require('./init_redis');
const Logger = require('./logger');

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = { expiresIn: '15s', issuer: 'simple-mern-todo-front.vercel.app', audience: userId };
            JWT.sign(payload, secret, options, (error, token) => {
                if (error) {
                    return reject(createError.InternalServerError());
                }
                Logger.debug(`helpers/jwt_helpers :  signAccessToken() { JWT.sign() token : ${token} }`);
                resolve(token);
            });
        });
    },
    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) {
            return next(createError.Unauthorized());
        }
        const token = req.headers['authorization'];
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
            if (error) {
                const message = error.message === 'JsonWebTokenError' ? 'Unauthorized' : error.message;
                return next(createError.Unauthorized(message));
            }
            req.payload = payload;
            Logger.debug(`helpers/jwt_helpers : verifyAccessToken() { JWT.verify() payload : ${payload} }`);
            next();
        });
    },
    verifyRefreshToken: (refreshToken) => {
        Logger.debug(refreshToken);
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, payload) => {
                if (error) {
                    return reject(createError.Unauthorized());
                }
                const userId = payload.aud;
                client.get(userId, (error, result) => {
                    if (error) {
                        reject(createError.InternalServerError());
                        return;
                    }
                    if (refreshToken === result) {
                        return resolve(userId);
                    }
                    Logger.debug(`helpers/jwt_helpers : verifyRefreshToken() { client.get result : ${result} }`);
                    reject(createError.InternalServerError());
                });
                resolve(userId);
            });
        });
    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: '1y',
                issuer: 'simple-mern-todo-front.vercel.app',
                audience: userId,
            };
            JWT.sign(payload, secret, options, (error, token) => {
                if (error) {
                    return reject(createError.InternalServerError());
                }
                client.set(userId, token, 'ex', 365 * 24 * 60 * 60, (error) => {
                    if (error) {
                        reject(createError.InternalServerError());
                        return;
                    }
                    Logger.debug(`helpers/jwt_helpers : signRefreshToken() { JWT.sign() token : ${token} }`);
                    resolve(token);
                });
            });
        });
    },
};
