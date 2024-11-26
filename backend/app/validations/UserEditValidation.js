const Joi = require('joi');
const User = require('../models/user')

const emailSchema = Joi.string()
    .required()
    .email()
    .trim(true);

const passwordSchema = Joi.object({
    prev: Joi.string()
            .required()
            .trim(true),

    newPassword:Joi.string()
                .min(8)
                .max(81)
                .required()
                .trim(true)
})

const validateAsync = async (value) => {
    const user = await User.findOne({ email: value });
    // console.log(user, 'user custom validation');
    if (user) {
        throw new Joi.ValidationError('Email already taken', [{
            message: 'Email already taken',
            type: 'string.email',
            path: ['email'],
            value,
        }]);
    }
};

const UserEditValidation = {}
UserEditValidation.validateEmail = async (req, res, next) => {
        try {
            const { error, value } = emailSchema.validate(req.body.email, { abortEarly: false });
            if (error) {
                return res.status(400).json({ error: error.details });
            }
            await validateAsync(value)
            next();
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }


UserEditValidation.validatePassword =  async (req, res, next) => {
        try {
            const { error, value } = passwordSchema.validate(req.body, { abortEarly: false });
            if (error) {
                return res.status(400).json({ error: error.details });
            }
            next();
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }


module.exports = UserEditValidation;
