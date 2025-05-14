import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();
const verifyToken = async(req,res,next) => {
    try{
        const token = req.cookies.token;
 
        if(!token){
            return res.status(401).json({
                success: false,
                message : "Not authenticated"
            })
        }

        const decoded = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        if(!decoded){
             return res.status(401).json({
                success: false,
                message : "Invali token"
            })
        }

        req.id = decoded.userId;
 
        next();
    }
    catch(error){
        console.error("Error verifying Token", error);
    }
}

export default verifyToken;