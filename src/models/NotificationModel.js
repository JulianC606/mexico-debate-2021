const mongoose = require('mongoose')

const Schema = mongoose.Schema

const NotificationSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, { timestamps: true })

const NotificationModel = mongoose.model('notification', NotificationSchema)

module.exports = NotificationModel
