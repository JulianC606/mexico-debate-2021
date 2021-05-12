const express = require('express')
const logger = require('morgan')
const path = require('path')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const indexRouter = require('./routers/indexRouter')

dotenv.config({ path: path.join(__dirname, '..', '.env'), debug: true })

const app = express()

connectDB()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api/v1/', indexRouter)

module.exports = app
