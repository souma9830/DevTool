import express from "express";
import {register,login,logout, sendVerifyotp, verifyEmail} from "../controllers/authController.js"
import { userAuth } from "../middleware/userauth.js";
const authRouter=  express.Router();
authRouter.post('/register',register);
authRouter.post("/login",login);
authRouter.post("/logout",logout);
authRouter.post("/send-verify-otp",userAuth,sendVerifyotp);
authRouter.post("/verify-account",userAuth,verifyEmail);
export default authRouter;