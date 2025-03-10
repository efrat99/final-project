const mongoose = require('mongoose')
const studentSchema = new mongoose.Schema({
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
        required:true
    },
    phone: {
        type: String
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Student', studentSchema)