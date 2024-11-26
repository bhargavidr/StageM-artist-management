const express = require('express')
const router = express.Router()

//controller 
const arManagerCtrl =  require('../app/controllers/arManagerCtrl')
const eventsCtrl = require('../app/controllers/eventsCtrl')
const applicationCtrl = require('../app/controllers/applicationCtrl')
const reqCtrl = require('../app/controllers/requestCtrl')

//middleware
const {upload, uploadFields} = require('../app/middlewares/multer')
const mediaUpload = require('../app/middlewares/mediaUpload')

//validation
const arManagerValidation = require('../app/validations/arManagerValidation')
const EventValidation = require('../app/validations/EventValidation')

router.post('/profile',upload.fields(uploadFields), arManagerValidation.create, arManagerCtrl.create)
router.get('/profile', arManagerCtrl.account)
router.put('/profile',upload.fields(uploadFields), arManagerValidation.update, arManagerCtrl.update)

router.post('/event',upload.fields(uploadFields), EventValidation, mediaUpload, eventsCtrl.create)
router.put('/event/:id',upload.fields(uploadFields), EventValidation,mediaUpload, eventsCtrl.update)
router.delete('/event/:id', eventsCtrl.delete)

router.put('/event/:eventId/application/:id', applicationCtrl.updateStatus)
router.get('/event/:eventId/applications',applicationCtrl.myApplications_event)
router.get('/event/:eventId/application/:id',applicationCtrl.singleApplication)

router.put('/event/:eventId/request/:id', reqCtrl.updateStatus)
router.get('/requests', reqCtrl.getManagerRequests )








module.exports = router