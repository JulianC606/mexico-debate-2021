const mongoose = require('mongoose')

const connect = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('Database successfully connected!')
  } catch (e) {
    console.error(e)
  }
}
module.exports = connect
