const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const artistProfile = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  username: { 
    type: String, 
    required: true 
  },
  artistName: { 
    type: String, 
    required: true 
  },
  pfp: String,
  bio: { 
    type: String 
  },
  links: [String],
  titles: [String],
  media: [{ 
    type: String 
  }],
  events: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Event' 
  }],
  createdAt: { 
    type: Date, 
  }
});

const Artist = model('Artist', artistProfile)

module.exports = Artist