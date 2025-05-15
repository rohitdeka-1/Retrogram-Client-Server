import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {type: mongoose.Schema.Types, ref: 'User'},
    receiver: {type: mongoose.Schema.Types, ref: 'User'},
    messages: [{type: String, requied: True}]
})

export const Message = mongoose.model('Message',messageSchema);