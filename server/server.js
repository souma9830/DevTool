import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectdb from "./config/mongodb.js";
import authRouter from "./routes/auth.routes.js"

const app=express();
const port= process.env.PORT ||  4000;
connectdb();
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));
app.get("/",(req,res)=>{
    res.send("Api Working");
})
app.use('/api/auth',authRouter)
app.listen(port,()=>{
    console.log(`You are in ${port}`);
    
})
