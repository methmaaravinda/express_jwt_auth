const express=require("express");
const router=express.Router();
const User=require('../model/userModel')

router.route('/')
    .post((req, res)=>{
        const email=req.body?.user?.email;
        const password=req.body?.user?.password;
        const user={email,password};
        // console.log(user)
        (async()=>{
            try{
                await User.create(user);
                res.json(user);
            }catch(err){
                res.json(err)
            }
        })()
    })
   


module.exports=router;