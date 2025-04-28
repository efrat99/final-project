const mongoose = require('mongoose')
const Course = require('./courseModel')
const learningSchema = new mongoose.Schema({

    word: {
        type: String,
        required: true
    },
    translatedWord: {
        type: String,
        required: true
    },
    // level: {
    //     type: Number,
    //     required: true
    // }
}, {
    timestamps: true
})

module.exports = mongoose.model('Learning', learningSchema)