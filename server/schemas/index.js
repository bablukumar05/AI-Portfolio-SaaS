const Joi = require("joi");

const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    otp: Joi.string().length(6),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const workspaceSchema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().max(500),
});

const commentSchema = Joi.object({
    content: Joi.string().min(1).max(1000).required(),
    projectId: Joi.string().hex().length(24),
    workspaceId: Joi.string().hex().length(24),
    parentId: Joi.string().hex().length(24),
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
    password: Joi.string().min(6).required(),
});

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    workspaceSchema,
    commentSchema,
};
