const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2
    },
    email: {
        type: String,
        unique: true,
        required: true,
        immutable: true
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    userType:{
        type:String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)