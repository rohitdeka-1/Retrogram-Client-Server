import express, { urlencoded } from "express";
import cors from "cors"
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDb from "./db/index.js"
dotenv.config();
const PORT = process.env.PORT;
const app = express();

//Middlewares
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
}
app.use(urlencoded({extended: true}));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));
app.disable('x-powered-by'); 


app.get("/",(req,res)=>{
    res.send("ROHIT DEKA RHD")
})


import router from "./routes/index.js";
import swaggerDocs from "./utils/swagger.js";
app.use("/api/v1", router);


app.listen(PORT,()=>{
    connectDb();
    swaggerDocs(app, PORT)
    console.log(`http://localhost:${PORT}`);
})