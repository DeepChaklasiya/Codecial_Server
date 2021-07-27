const mongoose = require("mongoose");
// var uniqueValidator = require('mongoose-unique-validator')

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// userSchema.plugin(uniqueValidator)
module.exports = mongoose.model("Message", MessageSchema);
