const express = require('express')
const router = express.Router();

const userCtrl = require("../app/controllers/userCtrl")
const artistCtrl = require('../app/controllers/artistCtrl')
const arManagerCtrl = require('../app/controllers/arManagerCtrl')
const eventsCtrl = require('../app/controllers/eventsCtrl')
const paymentCtrl = require('../app/controllers/paymentCtrl')

const AuthenticateUser = require('../app/middlewares/AuthenticateUser')

const RegisterValidation = require('../app/validations/RegisterValidation')
const LoginValidation = require('../app/validations/LoginValidation');
const {validateEmail, validatePassword} = require('../app/validations/UserEditValidation')

router.post('/register',RegisterValidation, userCtrl.register)
router.post('/login',LoginValidation, userCtrl.login)
router.get('/account',AuthenticateUser, userCtrl.account)

router.post('/account/verifyEmail', userCtrl.verifyEmail)
router.put('/account/email',AuthenticateUser,validateEmail, userCtrl.updateEmail) 
router.put('/account/password',AuthenticateUser,validatePassword, userCtrl.updatePassword) 
router.put('/forgotpassword',userCtrl.forgotPassword)

router.get('/profile/:id', AuthenticateUser, userCtrl.getUserProfile ) //get a profile - different models
router.get('/profile/:id/events', AuthenticateUser, arManagerCtrl.profileEvents ) 

router.get('/events', eventsCtrl.allEvents)
router.get('/event/:id', eventsCtrl.singleEvent)

router.get('/artists', artistCtrl.getAll)
router.get('/artists/:tag', artistCtrl.getByTag)
router.get('/artistManagers', arManagerCtrl.getAll)

//payment
router.post('/create-checkout-session',AuthenticateUser,paymentCtrl.checkout)
router.get('/update-premium',AuthenticateUser, paymentCtrl.updateUser)


module.exports = router