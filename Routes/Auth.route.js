const express = require('express');
const authRouter = express.Router();
const createError = require('http-errors');
const User = require('../Models/User.model');
const { authSchema } = require('../helpers/validation_schema');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_helper');

authRouter.post('/register', async (req, res, next) => {
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
});

authRouter.post('/login', async (req, res, next) => {
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

        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);

        res.send({ accessToken, refreshToken });
    } catch (e) {
        if (e.isJoi === true) {
            return next(createError.BadRequest('Invalid Username/Password'));
        }
        next(e);
    }
});

authRouter.post('/refresh-token', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw createError.BadRequest();
        }
        const userId = await verifyRefreshToken(refreshToken);

        const accessToken = await signAccessToken(userId);
        const refToken = await signRefreshToken(userId);

        res.send({ accessToken: accessToken, refreshToken: refToken });
    } catch (e) {
        next(e);
    }
});

authRouter.delete('/logout', async (req, res, next) => {
    res.send('logout route');
});

module.exports = authRouter;
