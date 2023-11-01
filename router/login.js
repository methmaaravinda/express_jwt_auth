const express=require('express');
const router=express.Router();
const User=require('../model/userModel');
const jwt=require('jsonwebtoken');
const cookie=require("cookie")
require('dotenv').config();

router.route('/')
    .post(async(req, res)=>{
        const email=req.body?.user?.email;
        const password=req.body?.user?.password;
        try{
            const findUser=await User.findOne({email,password}).exec();
            console.log("find user : "+findUser);
            if(!findUser){
                res.status(403).json({error:"invalid credentials"});
            }
            if(findUser){
                try{
                    const accessToken=jwt.sign(
                        {email}, 
                        process.env.ACCESS_TOKEN_SECRET, 
                        {expiresIn:10}
                    )
                    const refreshToken=jwt.sign(
                        {email}, 
                        process.env.REFRESH_TOKEN_SECRET, 
                        {expiresIn:10*60}
                    )
                    try{
                        const updateUser=await User.findOneAndUpdate(
                            {email, password},
                            {accessToken, refreshToken},
                            {new:true}
                        )
                        console.log("updated User : "+updateUser);
                        res.setHeader(
                            "Set-Cookie", 
                            cookie.serialize(
                                "refreshToken", 
                                refreshToken, 
                                {
                                    httpOnly:true,
                                    sameSite: "None",
                                    secure:true,
                                }
                            )
                        )
                        
                        res.json({accessToken,email})
                    }catch(err){
                        res.json({error:"error update user with accesstoken and r token.. "+err})
                    }
                }catch(err){
                    res.status(500).json({error:"server error-token generation"})
                }
            }
        }catch(err){
            res.sendStatus(500);
        }

        
    })

module.exports=router;