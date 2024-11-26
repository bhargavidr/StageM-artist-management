const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const eventSchema = new Schema({
  arManager: {
    type: Schema.Types.ObjectId,
    ref: 'ArtistManager'
  },
  eventTitle: {
    type: String,    
    trim: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: mongoose.Schema.Types.Mixed
  },
  media: [{ 
    type: String 
  }],
  artistTitles: {
    type: [String],
    default: null 
  },
  stipend: {
    type: [String],
    default: null 
  }, 
  prompts: [{
    prompt: {
      type: String,
      default: null 
    },
    isRequired: {
      type:Boolean,
      default: null 
    }
  }],
  applications:[{
    type: Schema.Types.ObjectId,
    ref: 'Application',
    default: []
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Event =  model('Event', eventSchema);
module.exports = Event
