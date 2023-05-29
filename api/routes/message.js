const router = require('express').Router();
const Message = require('../models/Message');

// create a new message
router.post('/', async (req, res) => {
  // create a new message
  const newMessage = new Message(req.body);

  try {
    // save the message
    const savedMessage = await newMessage.save();
    // send the saved message with a 200 status code
    res.status(200).json(savedMessage);
  }
  catch (err) {
    // send the error with a 500 status code
    res.status(500).json(err);
  }
});

// get all messages of a chat based on the chat ID
router.get('/:chatId', async (req, res) => {
  try {
    // find all messages where the chat ID is equal to the chat ID passed in params
    const messages = await Message.find({
      chatId: req.params.chatId,
    });

    // send the messages with a 200 status code
    res.status(200).json(messages);
  }
  catch (err) {
    // send the error with a 500 status code
    res.status(500).json(err);
  }
});

module.exports = router;