const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the name'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide the email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please Provide valid email'
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide the password'],
        minlength: 6,
    }
})

UserSchema.pre('save', async function(){
    // genSalt() generates Random Bytes -> Bigger Number = More Secure, More Random Bytes Generated also More Processing Power will be required!!!
    // 10 is good to go
    const salt = await bcrypt.genSalt(10)
    // hash() takes in the initial password and the random bytes to generate the hashed password
    this.password = await bcrypt.hash(this.password, salt)

    //Note: this refers to the document that will be created
})

UserSchema.methods.createJWT = function(){
    return jwt.sign({userID: this._id, name: this.name}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    })
}

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)