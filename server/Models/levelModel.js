const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const Learning = require('./learningModel')
const Practice = require('./practiceModel')
const levelSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true
    },
    learning:[ {
        type: ObjectId,
        ref: Learning,
        required: true,
      unique: true 
    }],
    practice: [{
        type: ObjectId,
        ref: Practice,
        required: true,
       unique: true
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Level', levelSchema)