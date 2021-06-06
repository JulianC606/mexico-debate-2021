// Dependencies
const express = require('express')
const logger = require('morgan')
const path = require('path')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const dotenv = require('dotenv')
const passport = require('passport')
const cors = require('cors')

// Configurations
const i18n = require('./config/i18n')
const connectDB = require('./config/db')

// Routers
const indexRouter = require('./routers/indexRouter')
const authRouter = require('./routers/authRouter')
const userRouter = require('./routers/userRouter')
const motionRouter = require('./routers/motionRouter')
const notificationRouter = require('./routers/notificationRouter')
const transmissionRouter = require('./routers/transmissionRouter')

// Initializations
dotenv.config({ path: path.join(__dirname, '..', '.env'), debug: true })

// Init Server
const app = express()

// Init Database
connectDB()

// Init Middlewares
app.use(logger('dev')) // Logger
app.use(cors())
app.use(express.json()) // JSON encoder
app.use(express.urlencoded({ extended: false })) // url encoder
app.use(cookieParser()) // cookie parser
app.use(i18n.init) // Translations
app.use(helmet()) // Headers
app.use('/', express.static(path.join(__dirname, './templates')))
app.set('view engine', 'ejs') // Template Renderer
app.set('views', path.join(__dirname, './templates')) // Set Views directory

// Import Auth Strategy
require('./auth/userAuth')

// Import Routers
// Auth not required by default
app.use('/api/v1/auth/', authRouter)
app.use('/api/v1/motions/', motionRouter)
app.use('/api/v1/notifications/', notificationRouter)
app.use('/api/v1/transmissions/', transmissionRouter)

// Auth required by default
app.use(
  '/api/v1/users/',
  passport.authenticate('jwt', { session: false }),
  userRouter
)

app.use('/api/v1/', indexRouter)

// Export Server
module.exports = app
