const Grade = require("../Models/gradeModel")

//get all grades
const getAllGrades = async (req, res) => {
    const grades = await Grade.find().lean()
    if (!grades?.length)
        return res.status(400).json({ message: 'There are no grades' })
    res.json(grades)
}

//get grade by Id
const getGradeById = async (req, res) => {
    const { _id } = req.paramas
    const grade = await Grade.findById(_id).exec()
    if (!grade) {
        return res.status(400).json({ message: 'Grade is not found' })
    }
    res.json(grade)
}

//get all student's grades
const getAllStudentGrades = async (req, res) => {
    const { _id } = req.paramas
    const grades = await Grade.find({student: {_id: _id}}).exec()
    if (!grades?.length)
        return res.status(400).json({ message: 'There are no grades for this student' })
    res.json(grades)
}


//post
const createGrade = async (req, res) => {
    const { mark, student, course, level } = req.body
    if (!mark)
        return res.status(400).json({ message: 'Grade is required' })
    if (!student)
        return res.status(400).json({ message: 'Student is required' })
    if (!course)
        return res.status(400).json({ message: 'Course is required' })
    if (!level)
        return res.status(400).json({ message: 'Level is required' })

    const grade = await Grade.create({ mark, student, course, level })
    if (!grade)
        res.status(400).json({ message: 'creation has failed' })
    res.json(grade)
}

//put
const updateGrade = async (req, res) => {
    const { _id, mark, student, course, level } = req.body
    if (!mark)
        return res.status(400).json({ message: 'Grade is required' })
    if (!student)
        return res.status(400).json({ message: 'Student is required' })
    if (!course)
        return res.status(400).json({ message: 'Course is required' })
    if (!level)
        return res.status(400).json({ message: 'Level is required' })

    const grade = await Grade.findById(_id).exec()
    if (!grade)
        return res.status(400).json({ message: 'Grade is not found' })

    grade.mark = mark
    grade.student = student
    grade.course = course
    grade.level = level

    const updatedGrade = await grade.save()
    res.json(`'${updatedGrade.mark}' '${updatedGrade.student}' '${updatedGrade.course}' '${updatedGrade.level}' is updated`)
}


// //delete
// const deleteGrade = async (req, res) => {
//     const { _id } = req.paramas
//     const grade = await Grade.findById(_id).exec()
//     if (!grade) {
//         return res.status(400).json({ message: 'Student is not found' })
//     }
//     const result = await student.deleteOne()
//     res.json(`'Student named '${-id}' is deleted`)
// }

module.exports = {
    getAllGrades,
    getAllStudentGrades,
    getGradeById,
    createGrade,
    updateGrade,
    // deleteGrade
}

