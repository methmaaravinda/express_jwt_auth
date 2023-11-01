const express = require('express');
require('dotenv').config();
const mongoose=require("mongoose")
const cors = require('cors');
const app = express();
const dbConnection=require("./dbConnection");
const verify=require("./router/verify");
const cookieParser=require("cookie-parser");
const port = 3000;
dbConnection();

app.use(express.json())
app.use(cors(require("./config/corsOpt")));
app.use(cookieParser());
app.use('/login', require('./router/login'));
app.use('/signUp', require('./router/signUp'));
app.use("/refreshToken", require("./router/refreshToken"));
app.use(verify);
app.get("/hello", (req, res)=> res.json({hello:"hello"}))



mongoose.connection.once('open', ()=>{
    console.log("connected to DB");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})

