// set up our mongo db connection and require mongoose
const mongoose = require('mongoose');

// Connect mongoosed and specify db name
mongoose.connect('mongodb://localhost/cocktails', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected')
});

mongoose.connection.on('disconncted', () => {
  console.log('Mongoose is disconnected')
});

mongoose.connection.on('error', (err) => {
  console.log(err, ': Mongoose failed to connect')
});