const Artist = require('../models/artist')
const Joi = require('joi')
const User = require('../models/user')

const artistValidation = {}

const profileSchema = Joi.object({
    username: Joi.string()
                .required()
                .trim(),

    artistName: Joi.string()
            .required(),

    pfp: Joi.any()
            .allow(""),

    titles: Joi.array()
                .optional(),

    bio: Joi.when('$isPremium', {
        is: false,
        then: Joi.forbidden(),
        otherwise: Joi.string().max(1000).optional().allow('')
    }),

    media: Joi.when('$isPremium', {
        is: false,
        then: Joi.forbidden(),
        otherwise: Joi.array().optional()
    }),

    links: Joi.when('$isPremium', {
        is: false,
        then: Joi.forbidden(),
        otherwise: Joi.array().max(6).optional()
    }),

    events: Joi.array()
                .optional()   

})

const customAsync = async(value) => {
    const artist = await Artist.findOne({username:value})
    if(artist){
        throw new Joi.ValidationError('Username unavailable', [{
            message: 'Username already taken',
            type: 'custom',
            path: ['string'],
            value 
        }])
    }
}

artistValidation.create = async (req,res,next) => {
    try{
        const artist = await Artist.findOne({userId: req.user.id})
        if(artist){
            return res.status(403).json({error:"Artist profile already exists"})
        }
        //adding files to body
        if (req.files) {
            if(req.files.pfp){
                req.body.pfp = req.files.pfp[0];
            }
            if(req.files.media){
                req.body.media = req.files.media;
            }
        }

        const user = await User.findById(req.user.id);

        const context = {
            isPremium: user.isPremium
        };

        const {error, value} = profileSchema.validate(req.body, {abortEarly: false, context})
        if(error){
            return res.status(400).json(error.details);
        }
        await customAsync(value.username)
        next()
    }catch(e){
        console.log(e)
        return res.status(400).json({error: e})
    }
}


//update 
const validateAsync = async (value, userId) => {
    const artist = await Artist.findOne({ username: value });
    // console.log(userId, artist, 'user custom validation');
    if (artist && artist.userId.toString() != userId.toString()) {
        throw new Joi.ValidationError('Username already taken', [{
            message: 'Username already taken',
            type: 'string',
            path: ['string'],
            value,
        }]);
    }
};

artistValidation.update = async (req,res,next) => {
    try {
        const profile = await Artist.findOne({userId: req.user.id})
        if (!profile){
            return res.status(404).json({error: 'Profile does not exist' })
        }

        if (req.files) {
            if(req.files.pfp){
                req.body.pfp = req.files.pfp[0];
            }
            if(req.files.media){
                req.body.media = req.files.media;
            }
        }

        const user = await User.findById(req.user.id);

        const context = {
            isPremium: user.isPremium
        };
        
        const { error, value } = profileSchema.validate(req.body, { abortEarly: false, context });
        if (error) {
            // console.log(error, 'validation')
            return res.status(400).json(error.details);
        }
        await validateAsync(value.username, req.user.id);
        next();
    } catch (err) {
        console.log(err)
        return res.status(400).json({error: err});
    }
}


module.exports = artistValidation