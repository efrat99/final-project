const mongoose = require('mongoose')
const { ObjectId ,Image} = mongoose.Schema.Types
const User = require('./userModel')
const Student = require('./studentModel')
const Level = require('./levelModel')

const courseSchema = new mongoose.Schema({
    language: {
        type: String,
        required: true
    },
    // img: {
    //     type: Image,
    // },
    teacher: {
        type: ObjectId,
        ref: User,
        required: true
    },
    students: [{
        type: ObjectId,
        ref: Student,
        required: true
    }],
    levels: [{
        type: ObjectId,
        ref: Level,
        required: true
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Course', courseSchema)