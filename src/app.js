import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

// const EventEmitter = require('events'); // Importing EventEmitter class
import EventEmitter from "events"

// Creating an object from EventEmitter class
const myTLSSocketObject = new EventEmitter();

// Setting a listener for a specific event named 'someEvent'
myTLSSocketObject.on('someEvent', () => {
  console.log('someEvent was emitted!');
});

// Emitting the 'someEvent' event
myTLSSocketObject.emit('someEvent');
myTLSSocketObject.setMaxListeners(15);



app.use(cors({
  origin:['http://localhost:4200'],
    credentials:true
}))

app.use(express.json({ limit:"16kb"}));
app.use(express.urlencoded({extended:true , limit:"16kb"}));
app.use(cookieParser())

import UserRoutes from './routes/user.route.js'
import BlogRoutes from "./routes/blog.routes.js"

app.use('/api/v1/user', UserRoutes);
app.use('/api/v1/blog', BlogRoutes);



app.post('/', (req,res)=>{
    res.send('hello world')
})

export {app}
