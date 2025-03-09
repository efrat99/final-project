const mongoose = require('mongoose')
const Course = require('./courseModel')
const practiceSchema = new mongoose.Schema({
    // courseId: {
    //     type: ObjectId,
    //     ref: Course,
    //     required: true
    // },
    // level: {
    //     type: Number,
    //     required: true
    // },
    question: {
        type: String,
        required: true
    },
    answers: [{
        type: String,
        required: true
    }],
    correctAnswer: {
        type: Number,
        max: 4,
        min: 1,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Practice', practiceSchema)