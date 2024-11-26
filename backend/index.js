require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const port = 3232

app.use(express.json())
app.use(cors())

//middleware
const AuthenticateUser = require('./app/middlewares/AuthenticateUser')
const AuthorizeRole = require('./app/middlewares/AuthorzieRole')
const {upload,uploadFields} = require('./app/middlewares/multer')


//routers
const userRoutes = require('./routes/user-routes')
const artistRoutes = require('./routes/artistRoutes')
const arManagerRoutes = require('./routes/arManager-routes')
const messageRoutes = require('./routes/message-routes')

//routes
app.use('/', userRoutes);       
app.use('/artist', AuthenticateUser, AuthorizeRole(['artist', 'Admin']), artistRoutes);
app.use('/arManager', AuthenticateUser, AuthorizeRole(['arManager', 'Admin']), arManagerRoutes);
app.use('/messages',AuthenticateUser, messageRoutes)


const configureDB = require('./config/db')
configureDB()

app.listen(port, ()=> {
    console.log('Server running on port' , port)
})