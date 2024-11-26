const User = require('../models/user')
const Artist = require('../models/artist')
const ArtistManager = require('../models/arManager')
const Message = require('../models/message')

// import { getReceiverSocketId, io } from "../lib/socket.js";
const messageCtrl = {}

messageCtrl.getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const artists = await Artist.find({ userId: { $ne: loggedInUserId } })
    const arManagers = await ArtistManager.find({ userId: { $ne: loggedInUserId } })
    const users = artists.concat(arManagers)
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

messageCtrl.getMessages = async (req, res) => {
  try {
    const otherUser = req.params.id;
    const myId = req.user.id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherUser },
        { senderId: otherUser, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// one api to get unread messages
messageCtrl.getUnread = async(req,res) => {
    try{
        const messages = await Message.find(
            { isRead:false, receiverId:req.user.id })
            .select('senderId'); 
        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


messageCtrl.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id

    if(message){
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            isRead: false
          });
      
          await newMessage.save();
    }

//     const receiverSocketId = getReceiverSocketId(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", newMessage);
//     }

//     res.status(201).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

messageCtrl.updateReadStatus = async(req,res) => {
    const { id: otherUser } = req.params;
    const myId = req.user.id
    try{
        await Message.updateMany({senderId:otherUser, receiverId:myId, isRead:false}, {isRead:true})
        const messages = await Message.find({
            $or: [
              { senderId: myId, receiverId: otherUser },
              { senderId: otherUser, receiverId: myId },
            ]
          }); 
        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = messageCtrl 