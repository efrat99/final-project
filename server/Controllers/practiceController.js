const Practice = require("../Models/practiceModel")

//get all Practices
const getAllPractices = async (req, res) => {
    const practice = await Practice.find().lean()
    if (!practice?.length)
        return res.status(400).json({ message: 'There are no practices' })
    res.json(practice)
}

//get grade by Id
const getPracticeById = async (req, res) => {
    const { _id } = req.params
    const practice = await Practice.findById(_id).exec()
    if (!practice) {
        return res.status(400).json({ message: 'Practice is not found' })
    }
    res.json(practice)
}


//post
const createPractice = async (req, res) => {
    const {question,answers,correctAnswer} = req.body
    if (!question)
        return res.status(400).json({ message: 'question is required' })
    if (!answers)
        return res.status(400).json({ message: 'answers is required' })
    if (!correctAnswer)
        return res.status(400).json({ message: 'correctAnswer is required' })

    const practice = await Practice.create({question,answers,correctAnswer})
    if (!practice)
        res.status(400).json({ message: 'creation has failed' })
    res.json(practice)
}

//put
const updatePractice = async (req, res) => {
    const { _id,question,answers,correctAnswer}= req.body
    if (!_id)
        return res.status(400).json({ message: 'id is required' })
    const practice = await Practice.findById(_id).exec()
    if (!practice)
        return res.status(400).json({ message: 'Practice is not found' })
if(question)
   practice.question=question
if(answers)
   practice.answers=answers
if(correctAnswer)
   practice.correctAnswer=correctAnswer
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
    createPractice,
    updatePractice,
    deletePractice
}

