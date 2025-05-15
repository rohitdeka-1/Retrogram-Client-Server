import { Conversation } from "../models/conversation.model";
import { Message } from "../models/message.model";

 

export const sendMessage = async(req,res) =>{
    try{

        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;

        let conversation = await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        });

        // Establish Conversation if not started.
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId,receiverId]  
            })
        }

        const newMessage = Message.create({
            senderId,
            receiver,
            message
        })

        if(newMessage){
            conversation.messages.push((await newMessage)._id)
        } 
        await Promise.all([conversation.save(),newMessage.save()]);

        // Socket

        

    } catch(err){
        console.log("Error seending message : ", err)
    }
}