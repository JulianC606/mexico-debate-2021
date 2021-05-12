const mongoose = require('mongoose')

const connect = async () => {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database successfully connected!'))
    .catch((error) => console.error(error))
}
module.exports = connect
