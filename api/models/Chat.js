// Create a schema for message
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatSchema = new Schema({
    users: {
      type: Array,
    }
  },
  {timestamps: true}
);

module.exports = mongoose.model('Chat', ChatSchema);
