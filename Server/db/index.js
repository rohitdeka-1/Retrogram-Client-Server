import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI=process.env.MONGO_URI;

const connectDb = async()=>{
    try{
        const connection = await mongoose.connect(MONGO_URI);
        console.log('Db connected');
    }
    catch(err){
        console.log('Error connecting Db',err);
        
    }
}

export default connectDb;