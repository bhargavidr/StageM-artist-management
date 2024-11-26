const Artist = require('../models/artist')
const ArtistManager = require('../models/arManager')
const Event = require('../models/event')
const Request = require('../models/request')

const requestCtrl = {}

requestCtrl.create = async (req,res) => {
    const {eventId} = req.params
    try{
        const event = await Event.findById(eventId)
        if(!event){
            return res.status(404).json({error: 'Event not found'})
        } 

        const artist = await Artist.findOne({userId: req.user.id})
        const isApplied = await Request.findOne({event: eventId, artist: artist._id})
        if(isApplied){
            return res.status(409).json({ error: 'You have already requested for this event' });
        }

        const newReq = new Request({
            event: event._id,
            arManager: event.arManager,
            artist: artist._id,
            status: 'Pending',
            createdAt: new Date()
        })
        await newReq.save() 
        res.status(201).json({message:'Request made successfully'})
    }catch(e){
        console.log(e)
        res.status(500).json({ error: 'Something went wrong while requesting' });
    }
}

requestCtrl.updateStatus = async (req,res) => {
    try{
        const { eventId, id } = req.params;
        const {status} = req.body;

        const request = await Request.findById(id)
        if(!request){
            return res.status(404).json({error: 'Request not found'})
        }

        const event = await Event.findById(eventId)
        if(!event){
            return res.status(404).json({error: 'Event not found'})
        } 

        if(status == 'Approved'){
            const artist = await Artist.findById(request.artist)
            artist.events.push(event)
            await artist.save()
        } else if (status != 'Rejected') {
            return res.status(400).json({error:'Invalid status value'});
        }

        const updatedReq = await Request.findByIdAndUpdate(id,
            {status},
            {new:true}
        )
        res.status(200).json({message: 'Request updated'});

    }catch(e){
        console.log(e)
        res.status(500).json({ error: 'Something went wrong while updating' });
    }
}



requestCtrl.getArtistRequests = async (req,res) => {
    try{       
        const artist = await Artist.findOne({userId: req.user.id})
        const requests = await Request.find({artist: artist._id}).populate('event','eventTitle')
                                                                 .populate('arManager','identityName')
                                                                 .sort({ createdAt: -1 });
        if(!requests){
            return res.status(404).json({ error: 'No requests' });
        }
        res.json(requests)
    }catch(e){
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

requestCtrl.getManagerRequests = async (req,res) => {
    try{
        const arManager = await ArtistManager.findOne({userId: req.user.id})
        const requests = await Request.find({arManager: arManager._id}).populate('event','eventTitle')
                                                                       .populate('artist',['username', 'artistName'])
                                                                       .sort({ createdAt: -1 });
        if(!requests){      
            return res.status(404).json({ error: 'No requests' });
        }
        res.json(requests)
    }catch(e){
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = requestCtrl