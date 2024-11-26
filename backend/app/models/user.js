const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: { 
      type: String, 
      required: true
    },
    password: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      required: true,
    //   ['admin', 'artist', 'eManagement']
    },
    isPremium: Boolean
  });

const User = model('User',userSchema)

module.exports = User



  