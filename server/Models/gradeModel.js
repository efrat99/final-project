const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const Course = require('./courseModel')
const Student = require('./studentModel')
const Level = require('./levelModel')

const gradeSchema = new mongoose.Schema({
    mark: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    student: {
        type: ObjectId,
        ref: Student,
        required: true
    },
    course: {
        type: ObjectId,
        ref: Course,
        required: true
    },
    level: {
        type: ObjectId,
        ref: Level,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Grade', gradeSchema)