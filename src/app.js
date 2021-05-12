// Dependencies
const express = require('express')
const logger = require('morgan')
const path = require('path')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const dotenv = require('dotenv')
const passport = require('passport')

// Configurations
const i18n = require('./config/i18n')
const connectDB = require('./config/db')

// Routers
const indexRouter = require('./routers/indexRouter')
const authRouter = require('./routers/authRouter')
const userRouter = require('./routers/userRouter')

// Initializations
dotenv.config({ path: path.join(__dirname, '..', '.env'), debug: true })

// Init Server
const app = express()

// Init Database
connectDB()

// Init Middlewares
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(i18n.init)
app.use(helmet())

// Import Auth Strategy
require('./auth/userAuth')

// Import Routers
app.use('/api/v1/auth/', authRouter)
app.use('/api/v1/user/', passport.authenticate('jwt', { session: false }), userRouter)
app.use('/api/v1/', indexRouter)

// Export Server
module.exports = app
