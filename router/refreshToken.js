const express=require("express");
const router=express.Router();
const User=require("../model/userModel");
const jwt=require("jsonwebtoken");
require("dotenv").config();

router.route("/")
    .get(async(req, res)=>{
        console.log("refresh Token : ",req?.cookies)
        const refreshToken=req?.cookies?.refreshToken;
        console.log("refresh token ...",refreshToken);
        try{
            const verifyUser=await User.findOne({refreshToken});
            console.log(verifyUser)
            if(!verifyUser){
                res.status(404).json({error: "user not found relates to the refresh token"});
            }
            if(verifyUser){
                try{
                    const decode=jwt.verify(
                        refreshToken,
                        process.env.REFRESH_TOKEN_SECRET
                    );
                    console.log(decode);
                    const accessToken=jwt.sign(
                        {email:decode.email}, 
                        process.env.ACCESS_TOKEN_SECRET, 
                        {expiresIn:10}
                    )
                    const updateUser=await User.findOneAndUpdate(
                        {refreshToken},
                        {accessToken}, 
                        {new:true}
                    )
                    console.log(updateUser);
                    res.json({
                        msg: "success",
                        accessToken
                    })
                }catch(err){
                    res.status(403).json({error: "invalid refresh token"})
                }
            }
        }catch(err){
            res.status(500).json({error: "deatbase error when finding a user",err});
        }
    })
module.exports=router;