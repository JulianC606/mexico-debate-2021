const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TransmissionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  url: {
    type: String,
    required: true
  }
}, { timestamps: true })

const TransmissionModel = mongoose.model('transmission', TransmissionSchema)

module.exports = TransmissionModel
