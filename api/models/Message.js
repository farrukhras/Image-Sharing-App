// Create a schema for message
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    chatId: {
      type: String,
    },
    sender: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  {timestamps: true}
);

module.exports = mongoose.model('Message', MessageSchema);
