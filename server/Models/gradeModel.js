const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const Course = require('./courseModel')
const Student = require('./studentModel')

const gradeSchema = new mongoose.Schema({
    student: {
        type: ObjectId,
        ref: Student,
        required: true
    },
    courseId: {
        type: ObjectId,
        ref: Course,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    grade: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Grade', gradeSchema)