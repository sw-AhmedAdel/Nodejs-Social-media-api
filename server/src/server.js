const http = require('http');
const app = require('./app');
const server = http.createServer(app);
require('dotenv').config();
const PORT = process.env.PORT;

const {startMongo} = require('./services/mongo');

async function startServer () {

  await startMongo();
  server.listen(PORT , () => {
  console.log('running server');
  })
}

startServer();

