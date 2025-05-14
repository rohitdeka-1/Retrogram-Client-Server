import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {type: mongoose.Schema.Types, ref: 'User'},
    receiver: {type: mongoose.Schema.Types, ref: 'User'},
    message: {type: String, requied: True}
})

export default message = mongoose.model('Message',messageSchema);