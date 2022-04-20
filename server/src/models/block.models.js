const Block = require('./block.mongo');

async function CreateBlock(blockedBy , blockThisUser) {
  const newBlock = new Block({
    blockedBy,
    blockThisUser,
  })
  await newBlock.save()
}

async function FindBlock(myID , blockThisId) {
 
  return await Block.findOne({  blockedBy:myID,  blockThisUser:blockThisId });
}

async function unBlockUser(blockId) {
  await Block.findByIdAndDelete(blockId);
}

//here if i want to get his page and i used his id i will check
//if the want to get my page using my id i wil but my id as a first parameter coz i did the block to him
async function checkBlock (myId , friendID){
  if(await FindBlock(myId.toString(), friendID)) {
    return true;
  }
  if(await FindBlock(friendID, myId.toString())) {
   return true;
  }
  return false;
}


async function GetMyBlocks(filter){
  return await Block.find(filter)
}
module.exports= {
  CreateBlock,
  FindBlock,
  unBlockUser,
  checkBlock,
  GetMyBlocks
}