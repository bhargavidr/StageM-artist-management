const Artist = require('../models/artist')
const Event = require('../models/event')
const cloudinary = require('../../config/cloudinary')


const artistCtrl = {}

artistCtrl.create = async (req, res) => {
    try { 
        const body = req.body 
        let result = ''
        let newData = {...req.body, userId: req.user.id}
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
        
        if (req.media.length > 0) {
            newData.media = req.media
        } 

        const artist = new Artist(newData) 
        await artist.save()
        res.status(201).json({message:'Profile created successfully',data: artist})
    } catch(err) {
        console.log(err) 
        res.status(500).json({ error: 'something went wrong'})
    }
}

artistCtrl.account = async (req, res) => {
    try{
        const artist = await Artist.findOne({userId: req.user.id}).populate('userId',['email','role','isPremium'])
                                                                .populate('events')
        res.json(artist)
    }catch(err){
        console.log(err) 
        res.status(500).json({ error: 'something went wrong'})
    }
}

artistCtrl.getAll = async (req, res) => {
        const search = req.query.search || ''
        const searchQuery = {
            $or: [
              { titles: { $regex: search, $options: 'i' } },  // Case-insensitive search in titles
              { artistName: { $regex: search, $options: 'i' } },  // Case-insensitive search in artistName
              { username: { $regex: search, $options: 'i' } }  // Case-insensitive search in username
            ]
        }
    try{
        const artists = await Artist.find(searchQuery)
        res.json(artists)
    }catch(err){
        console.log(err) 
        res.status(500).json({ error: 'something went wrong'})
    }
}

artistCtrl.getByTag = async (req, res) => {
    try{
        const tag = req.params.tag || ''
        const artists = await Artist.find({ titles: {$regex : tag, $options: 'i'} });
        res.json(artists)
    }catch(err){
        console.log(err) 
        res.status(500).json({ error: 'something went wrong'})
    }
}

artistCtrl.update = async (req, res) => {
    try { 
        console.log(req.body)
        let result = ''
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
        
        if (req.media.length > 0) {
            newData.media = req.media
        } 
        
        const artist = await Artist.findOneAndUpdate(
                        { userId: req.user.id }, newData, { new: true }
                    )
        res.json({data:artist, message:'Profile updated successfully' })
    } catch(err) {
        console.log(err) 
        res.status(500).json({ error: 'Something went wrong'})
    }
}

artistCtrl.delete = async (req, res) => {
    try {
        const deleted = await Artist.findOneAndDelete({userId: req.user.id}, { new: true });
        if (!deleted) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.status(200).json({ message: 'Profile deleted successfully', data: deleted });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



module.exports = artistCtrl 