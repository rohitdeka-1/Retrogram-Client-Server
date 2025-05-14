import mongoose from "mongoose";

const conversationalSchema = mongoose.Schema({
  participants: [{ types: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ types: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

export default conversation = mongoose.model('Conversation',conversationalSchema);