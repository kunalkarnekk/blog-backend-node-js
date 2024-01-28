import connectDB from "./db/db.js";
import dotenv from  "dotenv"
import { app } from "./app.js";

dotenv.config({
    path:"./.env"
})


connectDB()
    .then(()=>{
        app.listen(process.env.PORT || 5000 , ()=>{
            console.log(`server is running at port ${process.env.PORT }`);
        })
        
        app.on('ERROR', (err)=>{
            console.log(err);
            throw err
        })
    })
    .catch((error)=>{
        console.log('MONGODB coneection failed', error);
    })

