const express = require('express')
const mongoose =require("mongoose")
const cors  = require('cors')
const router = require('./router/route')
const passport = require('passport')

const app=express()
app.use(cors())
app.use(express.json())
app.use('',router)

app.use(passport.initialize())


mongoose.set('strictQuery', false)
app.listen(5000,()=>{
    console.log("server connected at port 5000");
        // mongoose.connect("mongodb://127.0.0.1:27017/freet?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0/",{
        //     useNewUrlParser:true,useUnifiedTopology:true,
        //  }) 
        mongoose.connect("mongodb+srv://vishwjeetthakur995:1234@cluster0.4vjljae.mongodb.net/?retryWrites=true&w=majority",{
            useNewUrlParser:true,useUnifiedTopology:true,
         }) 
    const db = mongoose.connection
    db.on('error',console.error.bind(console,"connecion error"))
    db.once('open',()=>{
        console.log("database connected");
    }) 
 
    
     
        


})