import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 
import usermodel from "../models/usermodel.js";
import transporter from "../config/nodemailer.js";
export const register=async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name|| !email || !password){
        return res.status(400).json({success:false,message:"Missing details "})
    }
        
try {
    const existingUser=await usermodel.findOne({email});
    if(existingUser){
        return res.json({success:false,message:"user already exist "});
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const user=new usermodel({name,email,password:hashedPassword});
    await user.save();
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn: '7d'});
    res.cookie('token',token, {
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV=== 'production'? 'none' : 'strict',
        maxAge: 7*24*60*60*1000,
    });
    
    const mailoption={
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome to Intryo",
        text: `Welcome to Intryo website. Your account has been created with email id: ${email}`
    }
    await transporter.sendMail(mailoption);
     return res.json({success:true});
} catch (error) {
    res.json({success:false,message:error.message})
}
}


export const login=async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.json({success:false, message:"email and password are required"});
    }
    try {   
        const user=await usermodel.findOne({email});
        if(!user){
            return res.json({success:false,message:"invalid Email"});
        }
        const ismatch=await bcrypt.compare(password,user.password);
        if(!ismatch){
            return res.json({success:false,message:"Invalid password"});
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.cookie('token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV=='production'?'none':'strict',
            maxAge: 7*24*60*60*1000,
        })
        return res.json({success:true});
        
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

export const logout=async(req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure: process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
        })
        return res.json({success:true,message:"Logout"});
    } catch (error) {
        return res.json({success:false,messgae:error.message})
    }
}