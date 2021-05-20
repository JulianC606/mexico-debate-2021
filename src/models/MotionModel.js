const mongoose = require('mongoose')

const Schema = mongoose.Schema

const MotionSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    round: {
      type: String,
      required: true
    },
    infoSlide: String

  }, {
    timestamps: true
  }
)

const MotionModel = mongoose.model('motion', MotionSchema)

module.exports = MotionModel
