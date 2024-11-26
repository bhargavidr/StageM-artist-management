const ArtistManager = require('../models/arManager')
const Event = require('../models/event')
const cloudinary = require('../../config/cloudinary')

const arManagerCtrl = {}

arManagerCtrl.create = async (req,res) => {
    try{
        const body = req.body
        let result = ''
        if(req.files?.pfp){
            try{
                const profilePicture = req.files.pfp[0]
                const response = await cloudinary.uploader.upload(profilePicture.path, {
                    resource_type: "auto",
                    folder:`profilePictures`
                });
                result = response.secure_url

            }catch(error){
                console.log(error) 
                res.status(500).json({ error })
            }
        }
        
        const arManager = new ArtistManager(body)
        arManager.userId = req.user.id
        arManager.pfp = result
        await arManager.save()
        res.status(201).json({message:'Profile created successfully', data:arManager})
    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'something went wrong'})
    }
}

arManagerCtrl.account = async (req, res) => {
    try{
        const arManager = await ArtistManager.findOne({userId: req.user.id}).populate('userId',['email','role','isPremium'])
        res.json(arManager)
    }catch(e){
        console.log(err) 
        res.status(500).json({ error: 'Something went wrong'})
    }
}

arManagerCtrl.profileEvents = async (req, res) => {
    const {id} = req.params
    try { 
        const event = await Event.find({ arManager: id }).populate('arManager',['identityName','username']);
        res.json(event);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

arManagerCtrl.update = async (req, res) => {
    try { 
        let newData = {...req.body}

        if(req.files?.pfp){
            try{
                const profilePicture = req.files.pfp[0]
                const response = await cloudinary.uploader.upload(profilePicture.path, {
                    resource_type: "auto",
                    folder:`profilePictures`
                });
                result = response.secure_url

            }catch(error){
                console.log(error) 
                res.status(500).json({ error })
            }
            newData.pfp = result
        }
        
        const arManager = await ArtistManager.findOneAndUpdate(
            { userId: req.user.id }, newData, { new: true }
        )
        res.json({message:'Profile updated successfully', data:arManager})
    } catch(err) {
        console.log(err) 
        res.status(500).json({ error: 'Something went wrong'})
    }
}

arManagerCtrl.getAll = async (req, res) => {
    const search = req.query.search || ''
        const searchQuery = {
            $or: [
              { identityName: { $regex: search, $options: 'i' } }, 
              { username: { $regex: search, $options: 'i' } } 
            ]
        }
    try{
        const managers = await ArtistManager.find(searchQuery)
        res.json(managers)
    }catch(err){
        console.log(err) 
        res.status(500).json({ error: 'something went wrong'})
    }
}


module.exports = arManagerCtrl