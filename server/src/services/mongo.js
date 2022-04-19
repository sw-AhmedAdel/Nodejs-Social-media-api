const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URL =process.env.MONGO_URL;

mongoose.connection.once('open' , () => {
  console.log('connectiong to mongo');
})

mongoose.connection.on('error' , () => {
  console.log('error can not connect to mongo');
})

async function startMongo () {
   await mongoose.connect(MONGO_URL);
}

async function disconnectMongo () {
  await mongoose.disconnect();
}

module.exports= {
  startMongo,
  disconnectMongo,
}