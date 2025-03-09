const Level = require("../Models/levelModel")

// getAllLevels
const getAllLevels= async (req, res) => {
    const levels = await Level.find().lean()
    if (!levels?.length) {
        return res.status(400).json({ message: 'There are no levels' })
    }
    res.json(levels)
}

//getById
const getLevelById=async(req,res)=>{
     const {_id} = req.params
    const level=await Level.findById(_id).exec()
    if(!level){
        return res.status(400).json({ message:'Level is not found' }) 
    }
    res.json(level)
}

//post
const createLevel = async (req, res) => {
    const { number, learning, practice} = req.body
    if (!number)
        return res.status(400).json({ message: 'number is required' })
    if (!learning)
        return res.status(400).json({ message: 'learning is required' })
    if (!practice)
        return res.status(400).json({ message: 'practice is required' })

    const level = await Level.create({ number, learning, practice})
    if (level) {
        res.json(level)//.status(201).json({message: 'Post is created successfully'})
    }
    else {
        res.status(400).json({ message: 'Invalid creation' })
    }
}

//put
const updateLevel = async (req, res) => {
    const {_id, number, learning, practice} = req.body
    if (!_id)
        return res.status(400).json({ message: 'id is required' })

    const level = await Level.findById(_id).exec()
    if (!level) {
        return res.status(400).json({ messege: 'level is not found' })
    }
    if(number)
        level.number=number
    if(learning)
        level.learning=learning
    if(practice)
        level.practice=practice
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