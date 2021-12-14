const express = require('express');
const authRouter = express.Router();
const AuthController = require('../Controllers/Auth.controller');

authRouter.post('/register', AuthController.registerUser);

authRouter.post('/login', AuthController.loginUser);

authRouter.post('/refresh-token', AuthController.refreshToken);

authRouter.delete('/logout', AuthController.logoutUser);

module.exports = authRouter;
