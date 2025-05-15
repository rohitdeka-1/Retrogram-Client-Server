import mongoose from "mongoose";

const conversationalSchema = mongoose.Schema({
  participants: [{ types: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ types: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

export const Conversation = mongoose.model('Conversation',conversationalSchema);