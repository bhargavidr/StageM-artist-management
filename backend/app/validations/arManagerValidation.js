const ArtistManager = require('../models/arManager');
const User = require('../models/user')
const Joi = require('joi');

const arManagerValidation = {};

const profileSchema = Joi.object({
    username: Joi.string()
                .required()
                .trim(),

    identityName: Joi.string()
                .required(),

    pfp: Joi.any()
            .allow(''),
    
    address: Joi.string().allow('')
                .optional(),

    bio: Joi.when('$isPremium', {
        is: false,
        then: Joi.forbidden(),
        otherwise: Joi.string().optional().allow('')
    }),

    links: Joi.when('$isPremium', {
        is: false,
        then: Joi.forbidden(),
        otherwise: Joi.array().max(6).optional()
    })
});

const customAsync = async (value) => {
    const arManager = await ArtistManager.findOne({ username: value });
    if (arManager) {
        throw new Joi.ValidationError('Username unavailable', [{
            message: 'Username already taken',
            type: 'custom',
            path: ['username'],
            context: { value }
        }]);
    }
};


arManagerValidation.create = async (req, res, next) => {
    try {
        const arManager = await ArtistManager.findOne({ userId: req.user.id });
        if (arManager) {
            return res.status(403).json({error:"Artist Manager profile already exists"})
        }

        const user = await User.findById(req.user.id);

        const context = {
            isPremium: user.isPremium
        };

        if(req.files.pfp){
            req.body.pfp = req.files.pfp[0];
        }
        
        const { error, value } = profileSchema.validate(req.body, { abortEarly: false, context});
        if (error) {
            return res.status(400).json(error.details);
        }
        
        await customAsync(value.username);
        next();
    } catch (e) {
        console.log(e)
        res.status(400).json({ error: e });
    }
};

// Update validation
const validateAsync = async (value, userId) => {
    const arManager = await ArtistManager.findOne({ username: value });
    if (arManager && arManager.userId.toString() !== userId.toString()) {
        throw new Joi.ValidationError('Username already taken', [{
            message: 'Username already taken',
            type: 'string',
            path: ['username'],
            context: { value }
        }]);
    }
};

arManagerValidation.update = async (req, res, next) => {
    try {
        const profile = await ArtistManager.findOne({userId: req.user.id})
        if (!profile){
            return res.status(404).json({error: 'Profile does not exist' })
        }

        const user = await User.findById(req.user.id);

        const context = {
            isPremium: user.isPremium
        };

        if(req.files.pfp){
            req.body.pfp = req.files.pfp[0];
        }

        const { error, value } = profileSchema.validate(req.body, { abortEarly: false, context });
        if (error) {
            return res.status(400).send(error.details);
        }
        
        await validateAsync(value.username, req.user.id);
        next();
    } catch (e) {
        console.log(e)
        return res.status(400).json({ error: e });
    }
};

module.exports = arManagerValidation;
