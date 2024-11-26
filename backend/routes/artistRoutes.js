const express = require('express')
const router = express.Router()

//controller 
const artistCtrl = require('../app/controllers/artistCtrl')
const applicationCtrl = require('../app/controllers/applicationCtrl')
const reqCtrl = require('../app/controllers/requestCtrl')

//validation
const ArtistValidation = require('../app/validations/ArtistValidation')
const ApplicationValidation = require('../app/validations/ApplicationValidation')

//middleware
const {upload, uploadFields} = require('../app/middlewares/multer')
const mediaUpload = require('../app/middlewares/mediaUpload')

router.post('/profile', upload.fields(uploadFields), ArtistValidation.create,mediaUpload, artistCtrl.create)
router.get('/profile', artistCtrl.account)
router.put('/profile', upload.fields(uploadFields), ArtistValidation.update, mediaUpload, artistCtrl.update)

router.post('/event/:eventId/request', reqCtrl.create )
router.get('/requests', reqCtrl.getArtistRequests )

router.get('/applications', applicationCtrl.myApplications_artist)
router.get('/application/:id',applicationCtrl.singleApplication) //add authlayer
router.post('/event/:eventId/application', ApplicationValidation, applicationCtrl.create )
router.put('/event/:eventId/application/:id', ApplicationValidation, applicationCtrl.update )
router.delete('/event/:eventId/application/:id', applicationCtrl.deleteApplication )


module.exports = router