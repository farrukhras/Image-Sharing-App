const router = require('express').Router();
const Chat = require('../models/Chat');

// create a new chat
router.post('/', async (req, res) => {
  // create a new chat
  const newChat = new Chat({
    // save the sender and receiver ids in an array
    users: [req.body.senderId, req.body.receiverId],
  });

  try {
    // save the chat
    const savedChat = await newChat.save();
    // send the saved chat with a 200 status code
    res.status(200).json(savedChat);
  }
  catch (err) {
    // send the error with a 500 status code
    res.status(500).json(err);
  }
});

// get chat of a user
router.get('/:userId', async (req, res) => {
  try {
    // find all chats where the user id is equal to the sender or receiver id
    const chats = await Chat.find({
      users: { $in: [req.params.userId] },
    });
    // send the chats with a 200 status code
    res.status(200).json(chats);
  }
  catch (err) {
    // send the error with a 500 status code
    res.status(500).json(err);
  } 
});

// get the chat between two users
router.get('/find/:firstUserId/:secondUserId', async (req, res) => {
  try {
    // find the chat between the two users
    const chat = await Chat.findOne({
      // find the chat where the users array contains both the first and second user id
      users: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    // send the chat with a 200 status code
    res.status(200).json(chat);
  }
  catch (err) {
    // send the error with a 500 status code
    res.status(500).json(err);
  }
});

module.exports = router;