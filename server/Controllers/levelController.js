const Level = require("../Models/levelModel")
const Course = require("../Models/courseModel")

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

//getInCourse
const getLevelsInCourse = async (req, res) => {
    
    const { courseId, number  } = req.query; // קבלת ה-Level מה-Query String
        try {
            console.log(courseId)
            console.log(number);
            const level = await Course.findById(courseId)
                .populate({
                    path: 'levels', // טוען את המסמכים של ה-levels
                    match: { number: number }, // מסנן את ה-level לפי המספר
                })
                .exec();

            console.log("Level Query Result:", level);
        
            if (!level) {
                return res.status(403).json({ message: 'Course not found' });
            }
        
            if (!level.levels || level.levels.length === 0) {
                return res.status(404).json({ message: 'Level not found in the course' });
            }
        
            // החזרת ה-learning של ה-level
            res.json(level); // מניחים שיש רק אחד מתאים

        } catch (error) {
            console.error('Caught error:', error); // חשוב מאוד להדפיס את השגיאה המלאה
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
};

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
        console.log('Level created:', level);
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
    getLevelsInCourse,
    createLevel,
    updateLevel,
    deleteLevel
}