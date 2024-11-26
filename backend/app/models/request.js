const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const requestSchema = new Schema({
    event: { 
      type: Schema.Types.ObjectId, 
      ref: 'Event', 
      required: true 
    },
    arManager: {
        type: Schema.Types.ObjectId, 
      ref: 'ArtistManager', 
      required: true 
    },
    artist: { 
      type: Schema.Types.ObjectId, 
      ref: 'Artist', 
      required: true 
    },
    status: {
      type: String,
      default: 'Pending',
      required: true 
    },
    createdAt: {
        type: Date, 
        default: Date.now 
    }
})

const Request = model('Request',requestSchema)

module.exports = Request