const Artist = require('../models/artist')
const Event = require('../models/event')
const Application = require('../models/application')
const User = require('../models/user')
const axios = require('axios')

const applicationCtrl = {}

applicationCtrl.create = async (req,res) => {
    try{
        const {eventId} = req.params

        const event = await Event.findById(eventId)
        if(!event){
            return res.status(404).json({error: 'Event not found'})
        } 
        const artist = await Artist.findOne({userId: req.user.id})
        const isApplied = await Application.findOne({event: eventId, appliedBy: artist._id})
        if(isApplied){
            return res.status(409).json({ error: 'You have already applied to this event' });
        }

        const newApplication = new Application(req.body)
        newApplication.appliedBy = artist._id
        newApplication.event = event._id
        newApplication.status = 'Applied' //change these to destructuring
        await newApplication.save()

        event.applications.push(newApplication)
        event.save()

        res.status(201).json({message: 'Application submitted',data: newApplication})

    }catch(e){
        console.log(e)
        res.status(500).json({ error: 'Something went wrong while creating application' });
    }
    
}

applicationCtrl.updateStatus = async (req, res) => {
    try {
        const { eventId, id } = req.params;
        const {status} = req.body;

        const event = await Event.findById(eventId)
        if(!event){
            return res.status(404).json({error: 'Event not found'})
        } 

        const validStatus = ['Applied', 'Under Review', 'Accepted', 'Rejected']
        if (!validStatus.includes(status)) {
            return res.status(400).json({error:'Invalid status value'});
        }

        const updatedApplication = await Application.findByIdAndUpdate(id,
            { $set: { status, updatedAt: Date.now() } }, //no validation passed so using set
            { new: true }).populate({
                                path: 'event',
                                populate: {
                                path: 'arManager',
                                select: ['username', 'pfp','identityName']
                                },
                                select: ['eventTitle', 'updatedAt', 'prompts']
                            })   
                        .populate('appliedBy',['username', 'userId', 'artistName']);

        if (!updatedApplication) {
            return res.status(404).json({ error: 'Application not found' });
        }

        const user = await User.findById(updatedApplication.appliedBy.userId).select('email')
        const message = {
            From: process.env.EMAIL,
            To: user.email ,
            Subject: 'Application status',
            TextBody: `Your application for ${event.eventTitle} is ${status}. The artist manager will reach out if anything required.`
        };        
        
        const response = await axios.post('https://api.postmarkapp.com/email', message, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-Postmark-Server-Token': process.env.EMAIL_TOKEN,
            },
          });

        res.status(200).json({message: 'Status updated',data: updatedApplication});
    } catch (e) {
        console.log(e)
        res.status(500).json({ error:'Something went wrong'});
    }
};

applicationCtrl.update = async (req, res) => {
    try {
        const {id } = req.params;
        const body = req.body;

        const application = await Application.findById(id)
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        } else if (application.status != 'Applied') {
            return res.status(403).json({error:'Cannot update after application is reviewed'});
        }

        const updatedApplication = await Application.findByIdAndUpdate(id,
            { ...body, updatedAt: Date.now() },
            { new: true })

        res.status(200).json({message: 'Application updated',data: updatedApplication});
    } catch (e) {
        console.log(e)
        res.status(500).json({ error:'Something went wrong'});
    }
};

applicationCtrl.myApplications_event = async(req,res) => {
    try {
        const { eventId } = req.params;
        const {page} = req.query

        const event = await Event.findById(eventId)
        if(!event){
            return res.status(404).json({error: 'Event not found'})
        } 
        const count = await Application.countDocuments({event: eventId});

        const applications = await Application.find({event: eventId})
                                            .skip(page * 5)
                                            .limit(5)
                                            .populate('event','eventTitle')
                                            .populate('appliedBy',['username','pfp'])
                                            .sort({ createdAt: -1 });

        if (!applications) {
            return res.status(404).json({ error: 'No applications' });
        }

        res.status(200).json({applications, count});
    } catch (e) {
        res.status(500).json({ error:'Something went wrong'});
    }
}

applicationCtrl.myApplications_artist = async(req,res) => {
    const {page} = req.query
    try {
        const artist = await Artist.findOne({userId: req.user.id})
        const count = await Application.countDocuments({appliedBy: artist._id});
        const applications = await Application.find({appliedBy: artist._id})
                                            .skip(page  * 5)
                                            .limit(5)
                                            .populate({
                                                path: 'event',
                                                populate: {
                                                  path: 'arManager',
                                                  select: ['username', 'pfp']
                                                },
                                                select: ['eventTitle', 'updatedAt']
                                              }) 
                                            .sort({ createdAt: -1 });


        if (!applications) {
            return res.status(404).json({ error: 'No applications' });
        }

        res.status(200).json({applications, count});
    } catch (e) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

applicationCtrl.singleApplication = async (req, res) => {
    try{
        const {id} = req.params
        const application = await Application.findById(id)
                                            .populate({
                                                path: 'event',
                                                populate: {
                                                path: 'arManager',
                                                select: ['username', 'pfp','identityName']
                                                },
                                                select: ['eventTitle', 'updatedAt', 'prompts']
                                            })   
                                            .populate('appliedBy',['username','artistName']);

        if (!application) {
            return res.status(404).json({ error: 'Application not found' })
        }

        res.status(200).json(application);
    }catch (error){

    }
}

// Delete an existing application
applicationCtrl.deleteApplication = async (req, res) => {
    try {
        const { eventId, id } = req.params;

        const event = await Event.findById(eventId)
        if(!event){
            return res.status(404).json({error: 'Event not found'})
        } 

        const deletedApplication = await Application.findByIdAndDelete(id);

        if (!deletedApplication) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.status(200).json({ message: 'Application deleted successfully', data: deletedApplication});
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = applicationCtrl