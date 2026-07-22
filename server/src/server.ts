import 'dotenv';
import connectDB from './lib/mongodb.js';
import { initializeWebSocketServer } from './websockets/y-websocket/setupWSConnection.js';
import type { RequestHandler } from 'express';
import  {createServer} from 'http';
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

//Routes
import {route as userRoute} from './routes/user.js';
import {route as documentRoute} from './routes/document.js'
import { userAuthorization } from './middleware/userAuthorization.js';

async function startServer(){
  try{
    const app = express();
    const server = createServer(app);

    //mongdb connection
    await connectDB()

    // @y/websocket-server
    initializeWebSocketServer(server)

    //middlewares
    app.use(express.json());
    app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY));

    app.use(cors({
      origin: [`${process.env.CLIENT_URL}`],
      credentials: true,
    }));

    app.use('/', userRoute, documentRoute)
    app.get('/logincheck', userAuthorization, (req, res) => { return res.status(200).json({ user: req.user }) })
    app.get('/health', (req, res) => { return res.status(200).json({ success: true }) })


    //start server
    server.listen(process.env.PORT, () => { 
      console.log(`Server started on port ${process.env.PORT}`);
    })
  } catch(err){
    console.error(err)
    process.exit(1);
  }
}

startServer()