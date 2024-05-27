const Joi = require('joi');

const albumSchema = Joi.object({
    title: Joi.string().min(3).max(100).required()
});

const validateAlbum = (req, res, next) => {
    const { error } = albumSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: 'Validation error', errors: error.details });
    }
    next();
};

const validateAlbumTitleUpdate = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(100).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: 'Validation error', errors: error.details });
    }
    next();
};

module.exports = {
    validateAlbum,
    validateAlbumTitleUpdate
};
