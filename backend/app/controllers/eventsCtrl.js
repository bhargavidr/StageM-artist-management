const Event = require('../models/event')
const ArtistManager = require('../models/arManager')
const Artist = require('../models/artist')
const Request = require('../models/request')
const Application = require('../models/application')
const opencage = require('opencage-api-client');


const eventsCtrl = {}

eventsCtrl.create = async (req,res) => {
    try { 
        const body = req.body 
        let location = {}

        //geocode the address
        const myKey=process.env.GEOCODE_KEY
        const address = body.location.trim()

        if(address != 'online'){
            const existingAddress = await Event.findOne({location : {address}})

            if(!existingAddress){
            const loc = await opencage.geocode({q: address, key:myKey})
                if(loc){
                    location = {            
                        address,
                        lat: loc.results[0].geometry.lat,
                        lng:loc.results[0].geometry.lng
                    }        
                }else{
                    return res.status(500).json({error: 'Geocoding error'})
                }
            } else {
                location = existingAddress.location
            }
        } else {
            location = address
        }
            
        //event model operations
        const arManager = await ArtistManager.findOne({userId: req.user.id})

        const event = new Event(body) 
        event.arManager = arManager._id
        event.location = location
        if (req.media.length > 0) {
            event.media = req.media
        } 
        await event.save()

        arManager.events.push(event)
        await arManager.save()
        
        res.json({message:'Event created successfully', data:event})
    } catch(err) {
        console.log(err) 
        res.status(500).json({ error: 'Something went wrong'})
    }
}

eventsCtrl.allEvents = async (req, res) => {
    try {
        const search = req.query.search || ''
        const searchQuery = {eventTitle: {$regex : search, $options: 'i'}}
        const event = await Event.find(searchQuery).populate('arManager','identityName');
        res.json(event);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


eventsCtrl.singleEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('arManager',['identityName','username']);;
        res.json(event);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

eventsCtrl.update = async (req, res) => {
    try {
        let body = {...req.body};
        const id = req.params.id
        const address = body.location.trim()
        let location = {}

        const event = await Event.findById(id) //add auth layer
        if(!event){
            return res.status(404).json({error: 'Event not found'})
        } 
        
        if(address != 'online'){
            const existingAddress = await Event.findOne({location : {address}})
            const myKey=process.env.GEOCODE_KEY

            if(!existingAddress){
            const loc = await opencage.geocode({q: address, key:myKey})
                if(loc){
                    location = {            
                        address,
                        lat: loc.results[0].geometry.lat,
                        lng:loc.results[0].geometry.lng
                    }        
                }else{
                    return res.status(500).json({error: 'Geocoding error'})
                }
            } else {
                location = existingAddress.location
            }
        } else {
            location = address
        }
        body.location = location
        body.prompts = event.prompts.length > 0 ? event.prompts : body.prompts // prevent from changing prompts


        if (req.media.length > 0) {
            body.media = req.media
        } 
        body.updatedAt = new Date()

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, body, { new: true }); //add auth layer
        // console.log(updatedEvent, 'event')
        res.json({message:'Event updated successfully', data: updatedEvent});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

eventsCtrl.delete = async (req, res) => {
    try {
        const {id} = req.params
        const deleted = await Event.findByIdAndDelete(id , { new: true });
        if (!deleted) {
            return res.status(404).json({ error: 'Event not found' });
        }
       
        await ArtistManager.findByIdAndUpdate(deleted.arManager, { $pull: { events: id } }); 
        await Artist.updateMany({ events: id }, { $pull: { events: id } });
        await Request.deleteMany({event:id})
        await Application.deleteMany({event:id})

        res.status(200).json({ message: 'Event deleted', data: deleted });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = eventsCtrl