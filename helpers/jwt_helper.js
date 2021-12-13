const JWT = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = { expiresIn: '1h', issuer: 'simple-mern-todo-front.vercel.app', audience: userId };
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    return reject(createError.InternalServerError());
                }
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
            next();
        });
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, payload) => {
                if (error) {
                    return reject(createError.Unauthorized());
                }
                const userId = payload.aud;
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
                resolve(token);
            });
        });
    },
};
