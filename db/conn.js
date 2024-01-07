
const mongoose=require("mongoose")
mongoose.connect("mongodb+srv://admin:admin@cluster0.0fjyio3.mongodb.net/").then(()=>{
    console.log("connection is succesful")
 }).catch((e)=>{
console.log(e)
 })


