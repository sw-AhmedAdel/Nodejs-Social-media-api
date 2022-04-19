const http = require('http');
const app = require('./app');
const server = http.createServer(app);
require('dotenv').config();
const PORT = process.env.PORT;

const {startMongo} = require('./services/mongo');
const user = require('./models/user.mongo')
const post = require('./models/post..mongo');
async function startServer () {

  await startMongo();
  //await user.deleteMany()
  //await post.deleteMany();
  server.listen(PORT , () => {
  console.log('running server');
  })
}

startServer();

