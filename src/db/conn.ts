
import mongoose from "mongoose"
mongoose.connect("mongodb://127.0.0.1:27017/courseSelling").then(()=>{
    console.log("connection is succesful")
 }).catch((e)=>{
console.log(e)
 })