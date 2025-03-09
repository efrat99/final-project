const mongoose = require('mongoose')
const Course = require('./courseModel')
const learningSchema = new mongoose.Schema({
    // courseId: {
    //     type: ObjectId,
    //     ref: Course,
    //     required: true
    // },
    // level: {
    //     type: Number,
    //     required: true
    // },
    word: {
        type: String,
        required: true
    },
    translatedWord: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Learning', learningSchema)