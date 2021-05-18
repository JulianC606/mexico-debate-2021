const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TransmissionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
}, { timestamps: true })

const TransmissionModel = mongoose.model('transmission', TransmissionSchema)

module.exports = TransmissionModel
