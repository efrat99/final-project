const Practice = require("../Models/practiceModel")
const Level = require("../Models/levelModel")

//get all Practices
const getAllPractices = async (req, res) => {
    const practice = await Practice.find().lean()
    if (!practice?.length)
        return res.status(400).json({ message: 'There are no practices' })
    res.json(practice)
}

//get practice by Id
const getPracticeById = async (req, res) => {
    const { _id } = req.params
    const practice = await Practice.findById(_id).exec()
    if (!practice) {
        return res.status(400).json({ message: 'Practice is not found' })
    }
    res.json(practice)
}

//get practice by level
const getPracticesByLevel = async (req, res) => {
    const { level } = req.query; // קבלת ה-Level מה-Query String
    try {
        const numericLevel = parseInt(level, 10);
        console.log(numericLevel)
        if (isNaN(numericLevel)) {
            return res.status(400).json({ message: 'Invalid level parameter' });
        }

        // שליפת ה-Level המתאים לפי המספר
        const levelData = await Level.findOne({ number: numericLevel }).populate('practice').exec();
        console.log(levelData)
        if (!levelData) {
            return res.status(404).json({ message: 'Level not found' });
        }

        // החזרת ה-Practices המשויכים ל-Level
        res.json(levelData.practice);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching practices', error });
    }
};

//getByLevelObject
const getPracticessByLevelObject = async (req, res) => {
    const { level } = req.query; // קבלת ה-Level מה-Query String
    try {
        // שליפת ה-Level המתאים לפי המספר
        console.log(level)
        const levelData = await Level.findById(level).populate('practice').exec();
        console.log(levelData)
        if (!levelData) {
            return res.status(404).json({ message: 'Level was not found' });
        }
        res.json(levelData.practice);
        // החזרת ה-Learnings המשויכים ל-Level

    } catch (error) {
        res.status(500).json({ message: 'Error fetching practices', error });
    }
};

//post
const createPractice = async (req, res) => {
    const { question, answers, correctAnswer } = req.body
    if (!question)
        return res.status(400).json({ message: 'question is required' })
    if (!answers)
        return res.status(400).json({ message: 'answers is required' })
    if (!correctAnswer)
        return res.status(400).json({ message: 'correctAnswer is required' })
    // if(!correctAnswer.isInteger())
    //     return res.status(400).json({ message: 'correctAnswer must be a number' })
    if (correctAnswer < 1 || correctAnswer > 4)
        return res.status(400).json({ message: 'correctAnswer must be at 1-4 range' })

    const practice = await Practice.create({ question, answers, correctAnswer })
    if (!practice)
        res.status(400).json({ message: 'Creation has failed' })
    res.json(practice)
}

//put
const updatePractice = async (req, res) => {
    const { _id, question, answers, correctAnswer } = req.body
    if (!_id)
        return res.status(400).json({ message: 'id is required' })
    const practice = await Practice.findById(_id).exec()
    if (!practice)
        return res.status(400).json({ message: 'Practice is not found' })
    if (question)
        practice.question = question
    if (answers)
        practice.answers = answers
    if (correctAnswer) {
        // if(!correctAnswer.isInteger())
        //     return res.status(400).json({ message: 'correctAnswer must be a number' })
        if (correctAnswer < 1 || correctAnswer > 4)
            return res.status(400).json({ message: 'correctAnswer must be at 1-4 range' })
        practice.correctAnswer = correctAnswer
    }
    const updatedPractice = await practice.save()
    res.json(`'${updatedPractice._id}' is updated`)
}

//delete
const deletePractice = async (req, res) => {
    const { _id } = req.params
    const practice = await Practice.findById(_id).exec()
    if (!practice) {
        return res.status(400).json({ message: 'practice is not found' })
    }
    const result = await practice.deleteOne()
    res.json(`'practice named '${_id}' is deleted`)

}

module.exports = {
    getAllPractices,
    getPracticeById,
    getPracticessByLevelObject,
    getPracticesByLevel,
    createPractice,
    updatePractice,
    deletePractice
}

