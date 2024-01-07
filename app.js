const express=require('express')
require("./db/conn");
const jwt = require('jsonwebtoken');
const {Admin,User,Course} = require("./db/models/Schema");
//acquriring route
const route=require('./routers/routes')

const app=express()


const PORT=process.env.PORT||5000

app.get("/",(req,res)=>{
    res.send("hello");
})

app.use(express.json());
app.use(route)


app.listen(PORT, () => console.log('Server running on port ', PORT));

