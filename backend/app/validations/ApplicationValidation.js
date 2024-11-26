const Joi = require('joi');
const Event = require('../models/event')
const Artist = require('../models/artist')

const promptResponsesValidation = async (value, event) => {
  
    const applicationTitles = value.artistTitles  
    if(applicationTitles.length > event.artistTitles.length){
      throw new Joi.ValidationError('Invalid number of titles', [{
        message: `Exceeding number of titles`,
        type: 'array',
        path: ['string'],
        value: applicationTitles
      }]);
    }else{ //should be one of the event titles 
      for (title of applicationTitles){
        if (!event.artistTitles.includes(title)) {
          throw new Joi.ValidationError('Invalid artist title', [{
            message: `This artist title is not required for the event`,
            type: 'array',
            path: ['string'],
            value: applicationTitles
          }]);
        }
      }
    }

  const { prompts } = event; 
    // console.log(promptResponses, prompts)
  if(value.promptResponses.length > prompts.length){
      throw new Joi.ValidationError('Invalid number of responses', [{
        message: `Exceeding number of responses`,
        type: 'array',
        path: ['string'],
        value: applicationTitles
      }]);
    }else{
    for (let i = 0; i < prompts.length; i++) {
      if (prompts[i].isRequired && (!value.promptResponses[i])) {
        throw new Joi.ValidationError('Response required', [{
          message: `Response missing for prompt ${i+1}`,
          type: 'array',
          path: ['string'],
          value: value.promptResponses[i]
      }]);
      }
    }
  }
 

};


const applicationSchema = Joi.object({

    artistTitles: Joi.array()
        .items(Joi.string()) 
        .required(),

    promptResponses: Joi.array()
        .required()

});


const validateApplication = async (req, res, next) => {
  try{

    const artist = await Artist.findOne({ userId: req.user.id });
    if (!artist) {
        return res.status(404).json({error: 'Artist profile not found'});
    }

    const currentDate = new Date();
    const event = await Event.findById(req.params.eventId);  
    if (!event) {
      return res.status(404).json({error: 'Event not found'});
    }
    if(event.date < currentDate){
      return res.status(404).json({error: 'Cannot apply for a past event'});
    }

    const { error, value } = applicationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json(error.details);
    }
    await promptResponsesValidation(value, event)
    next();
  }catch(error){
    console.log(error)
    res.status(500).json(error)
  }
};

module.exports = validateApplication;
