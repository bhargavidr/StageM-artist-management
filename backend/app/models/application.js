const mongoose = require('mongoose')
const {Schema, model} = mongoose


const applicationSchema = new Schema({
    event: { 
      type: Schema.Types.ObjectId, 
      ref: 'Event', 
      required: true 
    },
    appliedBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'Artist', 
      required: true 
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Accepted', 'Rejected'],
      required: true 
    },
    artistTitles: [String], 
    promptResponses: {
      type: [String],
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: { 
      type: Date,
      default: Date.now 
    }
  });


const Application = model('Application', applicationSchema)

module.exports = Application
  