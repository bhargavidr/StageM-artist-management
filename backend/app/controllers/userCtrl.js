const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Artist = require('../models/artist')
const ArtistManager = require('../models/arManager')
const _ = require('lodash')
const axios = require('axios')


const userCtrl = {}

userCtrl.register = async (req,res) => {
    const {email, password, role} = req.body
    try{
        const salt = await bcryptjs.genSalt();
        const hashed = await bcryptjs.hash(password, salt)
        const user = new User({
            email,
            password: hashed,
            role,
            isPremium: false
        })
        await user.save()
        res.status(201).json(user)
    }catch (err) {
        console.log(err)
        res.status(500).json({error:'Something went wrong'})
    }
}

userCtrl.login = async (req,res) => {
    const {email,password} = req.body
    try{
        const user = await User.findOne({email});
        if(user){
            const isAuth = await bcryptjs.compare(password, user.password)
            if(isAuth){
                const tokenData ={
                    id: user._id,
                    role: user.role
                }
                const token = jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: '6d'})                
                return res.json({token, user})
            }
            return res.status(404).json({error:'Invalid email/password'})
        }
        return res.status(404).json({error:'Invalid email/password'})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Something went wrong'})
    }
}

userCtrl.account = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user)
    } catch(err) {
        res.status(500).json({ error: 'something went wrong'})
    }
}

userCtrl.verifyEmail = async (req,res) => {
    const email = req.body.email
    try{
        const min = parseInt(process.env.MIN, 10);
        const max = parseInt(process.env.MAX, 10);
        const range = [min, max];
        const code = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];

        const message = {
            From: process.env.EMAIL,
            To: email,
            Subject: 'Verify Email',
            TextBody: `Your verification code - ${code}. Ignore this if you didn't request an email/password change, and for extra security, consider updating your password as well.`
        };        
        
        const response = await axios.post('https://api.postmarkapp.com/email', message, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-Postmark-Server-Token': process.env.EMAIL_TOKEN,
            },
          });
          res.status(201).json({message: 'Email sent',data: response.data, code});
    }catch(err){
        res.status(422).json({error: err})
    }
}

userCtrl.updateEmail = async (req,res) => {
    try{
        const user = await User.findByIdAndUpdate(req.user.id, {email: req.body.email}, {new: true}).select("-password");
        if(!user){
            return res.status(404).json({error: 'Account not found'})
        }

        res.status(200).json({ message: 'Email updated successfully', user});
    }catch(error){
        res.status(500).json({ error })
    }
}

userCtrl.updatePassword = async(req,res) => {
    const {prev, newPassword} = req.body
    try{
        const user = await User.findById(req.user.id)
        const isAuth = await bcryptjs.compare(prev, user.password)
  
        if(isAuth){
            const salt = await bcryptjs.genSalt();
            const hashed = await bcryptjs.hash(newPassword, salt)
            user.password = hashed
            await user.save()
            const data = _.pick(user, ['_id', 'email', 'role','isPremium'])
            return res.status(200).json({message:'Password updated', data})
        } else {
            res.status(404).json({error:'Incorrect password'})
        }  
    }catch(error){
        res.status(500).json({ error })
    }
}

userCtrl.forgotPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    
    try {
        const user = await User.findOne({ email });        
        if (!user) {
            return res.status(404).json({ error: 'User not found. Please enter your registered mail.' });
        }

        const salt = await bcryptjs.genSalt();
        const hashed = await bcryptjs.hash(newPassword, salt);
        user.password = hashed;
        await user.save();
        return res.status(200).json({ message: 'Password successfully updated' });        
    } catch (error) {
        res.status(500).json({ error: 'Server error, please try again later' });
    }
};


userCtrl.delete = async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }

        // if(req.user.role == 'Artist'){

        // }else if (req.user.role == 'eManager'){

        // }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

userCtrl.getUserProfile = async (req, res) => {
    const {id} = req.params;
    try{
        const artist = await Artist.findById(id).populate('userId',['email','role','isPremium']).populate('events')
        if (artist) {
            return res.json(artist);
        }

        const arManager = await ArtistManager.findById(id).populate('userId',['email','role','isPremium'])
        if (arManager) {
            return res.json(arManager);
        }
    
        res.status(404).json({ error: 'Profile not found' });
    }catch(e){
        res.status(500).json({ error: 'something went wrong'})
    }
}


module.exports = userCtrl