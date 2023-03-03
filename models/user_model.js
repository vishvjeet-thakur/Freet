const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    college:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true

    },
    password:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    }
})

const roomSchema =new mongoose.Schema({
    user:[{type:String
    }]
})

const maleSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    college:{
        type:String,
        required:true
    }
})

const femaleSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    college:{
        type:String,
        required:true
    }
})





const users = new mongoose .model('users',UserSchema)
const rooms = new mongoose .model('rooms',roomSchema)
const males = new mongoose .model('males',maleSchema)
const females = new mongoose .model('females',femaleSchema)



module.exports  ={users,rooms,males,females}