
const Joi = require('joi')
const User = require('../models/user')

const register = Joi.object({
    email: Joi.string()
            .required()
            .email()
            .trim(true),

    password:Joi.string()
                .min(8)
                .max(81)
                .trim(true)
                .required(),

    role :Joi.string()
            .valid('artist','arManager','Admin')
            .trim(true),

                
})

//custom validation for email
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



//validators
const RegisterValidation = async(req,res,next) => {
    try {
        const { error, value } = register.validate(req.body, { abortEarly: false });
        if (error) {
            // console.log(error, 'validation')
            return res.status(400).json(error.details);
        }
        await validateAsync(value.email);
        next()
    } catch (err) {
        return res.status(400).json(err);
    }
}


module.exports = RegisterValidation



