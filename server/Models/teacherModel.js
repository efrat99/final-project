const mongoose = require('mongoose')
const teacherSchema = new mongoose.Schema({
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
        required:'Please enter your email'
    },
    phone: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Teacher', teacherSchema)