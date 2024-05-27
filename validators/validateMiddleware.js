const { emailSchema, passwordSchema } = require('./authValidator');

const validateRegister = (req, res, next) => {
    const { email, password } = req.body;

    const { error: emailError } = emailSchema.validate(email);
    if (emailError) {
        return res.status(400).send({ message: 'Invalid email', error: emailError.message });
    }

    const { error: passwordError } = passwordSchema.validate(password);
    if (passwordError) {
        return res.status(400).send({ message: 'Invalid password', error: passwordError.message });
    }

    next();
};

module.exports = {
    validateRegister,
};
