require('dotenv').config()
const {createServer} = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser=require('cookie-parser')
const cors = require('cors');
const connectWebSocket = require('./service/websocketConnection.js')

//Routes
const userRoute = require('./routes/user');
const documentRoute = require('./routes/document')
const { userAuthorization } = require('./middleware/userAuthorization');

const app = express();
const server = createServer(app);

mongoose.connect(process.env.MONGO_URL).then((err)=>{
  console.log('connected mongo');
    })

// websocket server
connectWebSocket()

//middlewares
app.use(express.json());
app.use(cookieParser(`${process.env.COOKIE_PARSER_SECRET_KEY}`));

app.use(cors({
  origin: [`${process.env.CLIENT_URL}`],
  credentials: true,
}));

app.use('/',userRoute,documentRoute)
app.get('/llll',userAuthorization,(req,res)=>{return res.json({user:req.user})})


//start server
server.listen(process.env.PORT,()=>{console.log('Server Started');})