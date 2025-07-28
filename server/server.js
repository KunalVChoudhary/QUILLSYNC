require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cookieParser=require('cookie-parser')
const cors = require('cors');

//Routes
const userRoute = require('./routes/user');
const documentRoute = require('./routes/document')
const { userAuthorization } = require('./middleware/userAuthorization')

//authorization



const app=express();

mongoose.connect(process.env.MONGO_URL).then((err)=>{
  console.log('connected mongo');
    })

app.use(express.json())
app.use(cookieParser(`${process.env.COOKIE_PARSER_SECRET_KEY}`));

app.use(cors({
  origin: [`${process.env.CLIENT_URL}`],
  credentials: true,
}));

app.use('/',userRoute,documentRoute)
app.post('/llll',userAuthorization,(req,res)=>{return res.json({user:req.user})})


//start server
app.listen(process.env.PORT,()=>{console.log('Server Started');})