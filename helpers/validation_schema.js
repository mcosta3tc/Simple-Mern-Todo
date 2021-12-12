const Joi = require('@hapi/joi');

const authSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required(),
});

const taskSchema = Joi.object({
    title: Joi.string(),
});

module.exports = { authSchema, taskSchema };
