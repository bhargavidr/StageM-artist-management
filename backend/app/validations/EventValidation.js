const Joi = require('joi');
const ArtistManager = require('../models/arManager')
const User = require('../models/user')

const eventSchema = Joi.object({
    eventTitle: Joi.string()
        .required()
        .trim(),
    
    description: Joi.string()
        .required()
        .trim(),
    
    date: Joi.date()
        .required(),

    location:  Joi.string()
                    .required(),

    media: Joi.when('$isPremium', {
        is: true,
        then: Joi.alternatives().try(
            Joi.array().optional(),
            Joi.string().optional()
        ),
        otherwise: Joi.forbidden()
    }),
                      

    artistTitles: Joi.when('date', {
        is: Joi.date().greater(Joi.ref('$now')),
        then: Joi.array().items(Joi.string()).required(),
        otherwise: Joi.forbidden()
    }),

    stipend: Joi.when('date', {
        is: Joi.date().greater(Joi.ref('$now')),
        then: Joi.any().optional(),
        otherwise: Joi.forbidden()
    }),


    prompts: Joi.when('date', {
        is: Joi.date().greater(Joi.ref('$now')),
        then: Joi.array().optional(),
        otherwise: Joi.forbidden()
    })
});

const validateEvent = async (req, res, next) => {
    try {
        const arManager = await ArtistManager.findOne({ userId: req.user.id });
        if (!arManager) {
            return res.status(404).json({error: 'Artist Manager not found'});
        }

        const user = await User.findById(req.user.id);

        const context = {
            now: new Date(),
            isPremium: user.isPremium
        };

        if(req.files.media){
            req.body.media = req.files.media;
        }
 
        if (req.body.artistTitles) {
            req.body.artistTitles = JSON.parse(req.body.artistTitles);
        } 

        if (req.body.stipend) {
            req.body.stipend = JSON.parse(req.body.stipend);
        } 
        
        if (req.body.prompts) {
            req.body.prompts = JSON.parse(req.body.prompts);
        } 
        console.log(req.body, 'req body')
        const { error } = eventSchema.validate(req.body, { abortEarly: false, context });
        if (error) {
            return res.status(400).json(error.details);
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({err});
    }
};

module.exports = validateEvent;
