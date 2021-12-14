const { authSchema } = require('../helpers/validation_schema');
const User = require('../Models/User.model');
const createError = require('http-errors');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_helper');
const client = require('../helpers/init_redis');

module.exports = {
    registerUser: async (req, res, next) => {
        try {
            const result = await authSchema.validateAsync(req.body);

            const doesExist = await User.findOne({ email: result.email });

            if (doesExist) {
                throw createError.Conflict(`${result.email}, is already been register`);
            }

            const user = new User(result);

            const savedUser = await user.save();
            const accessToken = await signAccessToken(savedUser.id);
            const refreshToken = await signRefreshToken(savedUser.id);

            res.send({ accessToken, refreshToken });
        } catch (e) {
            if (e.isJoi === true) {
                e.status = 422;
            }
            next(e);
        }
    },
    loginUser: async (req, res, next) => {
        try {
            const { email, password } = await authSchema.validateAsync(req.body);
            const user = await User.findOne({ email });

            if (!user) {
                throw createError.NotFound('User not registered');
            }

            const isMatch = user.checkPassword(password);

            if (!isMatch) {
                throw createError.Unauthorized('Username/Password not valid');
            }

            console.log(user);

            const accessToken = await signAccessToken(user.id);
            const refreshToken = await signRefreshToken(user.id);

            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                path: '/auth/refresh-token',
                maxAge: 365 * 24 * 60 * 60,
            });

            res.json({
                accessToken,
                userId: user.id,
            });
        } catch (e) {
            if (e.isJoi === true) {
                return next(createError.BadRequest('Invalid Username/Password'));
            }
            next(e);
        }
    },
    refreshToken: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw createError.BadRequest();
            }

            const userId = await verifyRefreshToken(refreshToken);
            const accessToken = await signAccessToken(userId);
            const refToken = await signRefreshToken(userId);

            res.send({ accessToken: accessToken, refreshToken: refToken });
        } catch (error) {
            next(error);
        }
    },
    logoutUser: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw createError.BadRequest();
            }
            const userId = await verifyRefreshToken(refreshToken);
            client.del(userId, (error, value) => {
                if (error) {
                    console.log(error.message);
                    throw createError.InternalServerError();
                }
                console.log(value);
                res.sendStatus(204);
            });
        } catch (e) {
            next(e);
        }
    },
};
