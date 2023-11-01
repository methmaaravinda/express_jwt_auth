const mongoose=require("mongoose");
require('dotenv').config();

const dbConnection=async()=>{
    try{
        mongoose.connect(
            process.env.MONGO_DB_URI,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
    }catch(err){
        console.error(err);
    }
}

module.exports=dbConnection;