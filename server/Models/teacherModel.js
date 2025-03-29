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
        required: true,
        immutable: true
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Teacher', teacherSchema)