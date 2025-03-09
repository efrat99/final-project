const Learning = require("../Models/learningModel")

//getAllLearnings
const getAllLearnings= async (req, res) => {
    const learnings = await Learning.find().lean()
    if (!learnings?.length) {
        return res.status(400).json({ message: 'There are no Learnings' })
    }
    res.json(learnings)
}

//getById
const getLearningById = async (req, res) => {
    const { _id } = req.params
    const learning = await Learning.findById(_id).exec()
    if (!learning) {
        return res.status(400).json({ message: 'learning is not found' })
    }
    res.json(learning)
}

//post
const createLearning = async (req, res) => {
    const { word, translatedWord } = req.body
    if (!word)
        return res.status(400).json({ message: 'word is required' })
    if (!translatedWord)
        return res.status(400).json({ message: 'translatedWord is required' })

    const learning = await Learning.create({ word, translatedWord })
    if (learning) {
        res.json(learning)//.status(201).json({message: 'Post is created successfully'})
    }
    else {
        res.status(400).json({ message: 'Invalid creation' })
    }
}

//put
const updatelearning = async (req, res) => {
    const {_id, word, translatedWord } = req.body
    if (!_id)
        return res.status(400).json({ message: 'id is required' })


    const learning = await Learning.findById(_id).exec()
    if (!learning) {
        return res.status(400).json({ messege: 'learning is not found' })
    }
    if (word)
    learning.word = word
    if (translatedWord)
    learning.translatedWord = translatedWord

    const updatedLearning = await learning.save()
    res.json(`'${updatedLearning.word}' '${updatedLearning.translatedWord}' is updated`)
}


//delete
const deleteLearning = async (req, res) => {
    const { _id } = req.params
    const learning = await Learning.findById(_id).exec()
    if (!learning) {
        return res.status(400).json({ message: 'Learning is not found' })
    }
    const result = await learning.deleteOne()
    const reply = `Learning '${_id}' is deleted`
    res.json(reply)
}


module.exports = {
    getAllLearnings,
    getLearningById,
    createLearning,
    updatelearning,
    deleteLearning
}