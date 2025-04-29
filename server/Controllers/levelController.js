const Level = require("../Models/levelModel")

// getAllLevels
const getAllLevels = async (req, res) => {
    const levels = await Level.find().lean()
    if (!levels?.length) {
        return res.status(400).json({ message: 'There are no levels' })
    }
    res.json(levels)
}

//getById
const getLevelById = async (req, res) => {
    const { _id } = req.params
    const level = await Level.findById(_id).exec()
    if (!level) {
        return res.status(400).json({ message: 'Level is not found' })
    }
    res.json(level)
}

//post
const createLevel = async (req, res) => {
    const { number, learning, practice } = req.body
    console.log('Request body:', req.body);
    // console.log(typeof Number(levelnum))
    // number=Number(number)
    if (!number)
        return res.status(400).json({ message: 'number is required' }) 
      
    if (!learning)
        return res.status(400).json({ message: 'learning is required' })
    //const learningExists = await Teacher.findOne({ learning: learning }).exec();
    // if (learningExists)
    //     return res.status(400).json({ message: 'Learning is already in use in other level. Please choose another' })
    if (!practice)
        return res.status(400).json({ message: 'practice is required' })
    //const practiceExists = await Teacher.findOne({ practice: practice }).exec();
    // if (practiceExists)
    //     return res.status(400).json({ message: 'Practice is already in use in other level. Please choose another' })
   
    try{
    const level = await Level.create({number , learning, practice })
    if (level) {
        res.json(level)//.status(201).json({message: 'Post is created successfully'})
    }
    else {
        res.status(400).json({ message: 'Invalid creation' })
    }
}
catch (err) {
    console.error(err)      
}
}

//put
const updateLevel = async (req, res) => {
    const { _id, number, learning, practice } = req.body
    if (!_id)
        return res.status(403).json({ message: 'id is required' })

    const level = await Level.findById(_id).exec()
    if (!level) {
        return res.status(401).json({ messege: 'level is not found' })
    }
    if (number)
        level.number = number
    if (learning){
        level.learning = learning;

    // הסר כפילויות במערך
    // level.learning = [...new Set(level.learning.map(id => id.toString()))].map(id => mongoose.Types.ObjectId(id));
        // level.learning = learning
    }
    if (practice)
        level.practice = practice
    const updatedLevel = await level.save()
    res.json(`'${updatedLevel._id}' is updated`)
}

//delete
const deleteLevel = async (req, res) => {
    const { _id } = req.params
    const level = await Level.findById(_id).exec()
    if (!level) {
        return res.status(400).json({ message: 'Level is not found' })
    }
    const result = await level.deleteOne()
    const reply = `Level '${_id}' is deleted`
    res.json(reply)
}


module.exports = {
    getAllLevels,
    getLevelById,
    createLevel,
    updateLevel,
    deleteLevel
}