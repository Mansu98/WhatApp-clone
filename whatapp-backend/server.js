import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Messages from "./dbMessages.js";
import Pusher from "pusher";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cors());

const pusher = new Pusher({
  appId: "1220933",
  key: "1d91ac60d7141f8228c7",
  secret: "0f5450fd09cdcc6f284c",
  cluster: "ap2",
  useTLS: true
});


mongoose.connect("mongodb+srv://mernuser:user1@mernproject.iccbl.mongodb.net/WhatAppCLone?retryWrites=true&w=majority",{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then (()=>{
    console.log("Connection Successful");
}).catch(()=>{
    console.log("Connection Unsuccessful");

});

const db = mongoose.connection;
db.once("open",()=>{
    console.log("DB Connected");

    const msgCollection = db.collection("messagecontents");
     const changeStream = msgCollection.watch();
      
     changeStream.on("change",(change)=>{
         console.log("A change Occured",change);

         if (change.operationType==="insert"){
             const msgDetails = change.fullDocument;
             pusher.trigger('messages',"inserted",
             {
                 name:msgDetails.name,
                 message:msgDetails.message,
                 timestamp:msgDetails.timestamp,
                 received:msgDetails.received,
             });
         }
         else{
             console.log("Error triggering Pusher");
         }
     });
});



app.get("/", (req,res)=>
    res.status(200).send("Connected")
);
app.post("/messages/new",(req,res)=>{
    const dbMessage = req.body;
    Messages.create(dbMessage,(err,data)=>{
        if(err){
            res.status(500).send(err)
        }
            else{
                res.status(201).send(data)
            }
        }
    )
})
app.get("/messages",(req,res)=>{

    Messages.find((err,data)=>{
        if(err){
            res.status(500).send(err)
        }
            else{
                res.status(201).send(data)
            }
        }
    )
})



app.listen(port,()=>{
    console.log(`server is connected at port :${port}`)
})

