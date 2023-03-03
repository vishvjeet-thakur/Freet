const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const {users,rooms,males,females} = require('../models/user_model')
const bodyParser = require('body-parser')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt= require('jsonwebtoken')


const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "7yJjlUk6LddqjbvpcUz6WI8Vzg21VaIUILtjqKMqSPTzCfqXBOQnloNvpEMTukch" // Replace with your own JWT secret key
};

passport.use(new JwtStrategy(options, function(jwt_payload, done) {
    users.findOne({
        _id:jwt_payload.sub}, function(err, user) {
        
        if (err) {
            
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
           
            return done(null, false);
            // or you could create a new account
        }
    });
}));

    function requireAuth(req, res, next) {
        
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            
          if (err || !user ) {
            console.log("not working")
            return res.redirect('/login/2'); // redirect to verification error page
          }
          req.user = user;
          console.log("authorized")
          // attach user object to request object
          return next();
        })(req, res, next);
      }


   





router.post('/register',async(req,res)=>{
    const {name,email,gender,college,password}= req.body
    const newuser = await new users({
        name,email,gender,college,password
    })
    await newuser.save((err,result)=>{
        if(err && err.code==11000)
        {   console.log("email already used")
            res.send({redirect:false})
        }
        else {console.log("user saved")
        res.send({redirect:true})
    }
    })
})

router.post('/login',async(req,res)=>{
    const {email,password} = req.body
   await users.findOne({email:email}).then(result=>{
    if(result)
   { 
    if(result.password==password){
    const token = jwt.sign({ sub:result._id }, '7yJjlUk6LddqjbvpcUz6WI8Vzg21VaIUILtjqKMqSPTzCfqXBOQnloNvpEMTukch', { expiresIn: '120h' });
     res.send({auth:true,token:token,name:result.name,gender:result.gender,uid:result._id})
   
}
    else {
        res.send({auth:false,user:true})
    }
   }
   else{
    res.send({auth:false,user:false})
   }

   }).catch(err=>console.error(err))
  
  
   
})

router.get('/user',requireAuth,async(req,res)=>{
   console.log("this is that")
    console.log("jwt",req.user)
    res.send({user:req.user})

}) 

router.get('/delete_room/:uid',requireAuth,async(req,res)=>{
   const uid = req.params.uid
    const ids = await rooms.find()
   if(ids.length==1)
{
    await rooms.deleteOne({_id:ids[0]._id}).then(async(result)=>{
        console.log("room deleted")
        const new_room = await new rooms()
        new_room.user.push(uid)
        new_room.save().then(room=>{
            console.log("new room created with id:",new_room._id)
            res.send({room:new_room._id})
        }).catch(err=>console.error(err))
    }).catch(err=>console.error(err))
}
})

router.get('/check_rooms/:uid',requireAuth,async(req,res)=>{
    console.log("ok")
    const uid = req.params.uid
    console.log("called",uid)
    
   const total_doc = await rooms.countDocuments()
   if(total_doc==0)
   {
    const new_room = await new rooms()
    new_room.user.push(uid) 
    await new_room.save().then(result=>{
        res.send({initiator:true,room:result._id})
        console.log("new room created")})
        console.log("initiator")
    
   }
   else{ 
    const ids = await rooms.find()
    const length = ids[total_doc-1].user.length
    console.log(length,total_doc)
    // if(length==1)
    // {
    //     const room = await rooms.findOne({_id:ids[total_doc-1]._id}).then(async(result)=>{

    //          result.user.push(uid)
    //        await result.save()
    //        if(length==1)res.send({initiator:true,room:result._id})
    //        else res.send({initiator:true})
    //        console.log("not a initiator")
 
    //     })
         
    // }
    // else
     if(length==1)
    {
        await rooms.findOne({_id:ids[total_doc-1]._id}).then(async(result)=>{
            res.send({initiator:false,other:result.user[0],room:result._id})
            // result.user.push(uid)
         
          console.log("not a initiator")

       })
       await rooms.deleteOne({_id:ids[total_doc-1]._id})
       console.log(" 2 members completed so room deleted as well") 
    }
}
  
    
}

)


module.exports=router