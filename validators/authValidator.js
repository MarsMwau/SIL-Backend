const Joi = require('joi');

const emailSchema = Joi.string().email().required();

const passwordSchema = Joi.string()
    .min(8)
    .max(14)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 'password')
    .not(Joi.string().pattern(/^(?=.*\bname\b|\busername\b|\bemail\b|\bpassword\b).*$/))
    .not(Joi.string().pattern(/^[a-zA-Z0-9]*$/))
    .required();

module.exports = {
    emailSchema,
    passwordSchema
};
