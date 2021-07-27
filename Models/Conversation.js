const mongoose = require("mongoose");
// var uniqueValidator = require('mongoose-unique-validator')

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

// userSchema.plugin(uniqueValidator)
module.exports = mongoose.model("Conversation", ConversationSchema);
