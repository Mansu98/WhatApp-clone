import mongoose from "mongoose";
const whatappSchema = mongoose.Schema({
   
    message:String,
    name:String,
    timestamp:String,
    received:Boolean
  
})
export default mongoose.model('messagecontent', whatappSchema);