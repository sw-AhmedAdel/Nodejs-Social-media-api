const http = require('http');
const app = require('./app');
const server = http.createServer(app);
require('dotenv').config();
const PORT = process.env.PORT;

const {startMongo} = require('./services/mongo');
const user = require('./models/user.mongo')
const post = require('./models/post..mongo');
const block= require('./models/block.mongo');
const comment=require('./models/comment.mongo')
const LikeComment= require('./models/like.comment.mongo')
async function startServer () {

  await startMongo();
  //await user.deleteMany()
  //await post.deleteMany();
  //await comment.deleteMany()
  //await LikeComment.deleteMany()
  //await block.deleteMany();
  server.listen(PORT , () => {
  console.log('running server');
  })
}

startServer();

