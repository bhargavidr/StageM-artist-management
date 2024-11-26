const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const arManagerProfile = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  username: { 
    type: String, 
    required: true 
  },
  identityName: { 
    type: String, 
    required: true 
  },
  events: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Event' ,
    default: []
  }],
  bio: { 
    type: String 
  },
  pfp: { 
    type: String 
  },
  address: { 
    type: String 
  },
  links : [String], 
  createdAt:  Date, 

});

const ArtistManager = model('ArtistManager',arManagerProfile)

module.exports = ArtistManager