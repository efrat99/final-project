const Learning = require("../Models/learningModel")
const Level = require("../Models/levelModel")

//getAllLearnings
const getAllLearnings = async (req, res) => {
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

//getByLevelObject
const getLearningsByLevelObject = async (req, res) => {
    const { level } = req.query; // קבלת ה-Level מה-Query String
    try {
        // שליפת ה-Level המתאים לפי המספר
        console.log(level)
        const levelData = await Level.findById(level).populate('learning').exec();
        console.log(levelData)
        if (!levelData) {
            return res.status(404).json({ message: 'Level was not found' });
        }
        res.json(levelData.learning);
        // החזרת ה-Learnings המשויכים ל-Level

    } catch (error) {
        res.status(500).json({ message: 'Error fetching learnings', error });
    }
};


//getByLevelNumber
const getLearningByLevelNumber = async (req, res) => {
    const { level } = req.query; // קבלת level מתוך ה-query
    if (!level) {
        return res.status(400).json({ message: 'Level is required' });
    }
    try {
        const learning = await Learning.find({ level }).exec(); // חיפוש לפי level

        if (!learning || learning.length === 0) {
            return res.status(404).json({ message: 'Learning was not found for this level' });
        }
        res.json(learning);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


//post
const createLearning = async (req, res) => {
    const { word, translatedWord } = req.body
    if (!word)
        return res.status(400).json({ message: 'word is required' })
    if (!translatedWord)
        return res.status(400).json({ message: 'translatedWord is required' })
    // if (!level)
    //     return res.status(400).json({ message: 'level is required' })
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
    const { _id, word, translatedWord } = req.body
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
    getLearningsByLevelObject,
    getLearningByLevelNumber,
    createLearning,
    updatelearning,
    deleteLearning
}