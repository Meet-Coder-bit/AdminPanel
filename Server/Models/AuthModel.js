const mongoose = require("mongoose")

const signupSchema = new mongoose.Schema({
    username : String,
    email : String,
    password : String,
    role : { default : "user" , type : String} ,
    otp : Number,
    otpExpire : Number
})

const signupModel = mongoose.model("User",signupSchema)

module.exports = signupModel