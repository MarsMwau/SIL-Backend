const Joi = require('joi');

const createPhotoSchema = Joi.object({
    albumId: Joi.string().required(),
    title: Joi.string().min(3).max(100).required(),
    imageUrl: Joi.string().uri().required()
});

const updatePhotoTitleSchema = Joi.object({
    title: Joi.string().min(3).max(100).required()
});

const validateCreatePhoto = (req, res, next) => {
    const { error } = createPhotoSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: 'Validation error', errors: error.details });
    }
    next();
};

const validateUpdatePhotoTitle = (req, res, next) => {
    const { error } = updatePhotoTitleSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: 'Validation error', errors: error.details });
    }
    next();
};

module.exports = {
    validateCreatePhoto,
    validateUpdatePhotoTitle
};
