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
    const { _id } = req.params
    if (!_id)
        return res.status(400).json({ message: '_id is not found' })
    const grade = await Grade.findById(_id).exec()
    if (!grade) {
        return res.status(400).json({ message: 'Grade is not found' })
    }
    res.json(grade)
}

//get all student's grades
const getAllStudentGrades = async (req, res) => {
    const { _id } = req.params
    // if (!mongoose.Types.ObjectId.isValid(_id)) {
    //     return res.status(400).json({ message: "Invalid student ID" });
    // }
    const grades = await Grade.find({ student: { _id: _id } }).exec()
    if (!grades?.length)
        return res.status(400).json({ message: 'There are no grades for this student' })
    res.json(grades)
}

//get Grade By Student And Level
const getGradeByStudentAndLevel = async (req, res) => {
    const { student, level } = req.query
    if (!student || !level)
        return res.status(400).json({ message: 'Student and Level are required' })

    const grade = await Grade.findOne({ student: student, level: level }).exec()
    if (!grade)
        return res.status(400).json({ message: 'There is no grade for this student and level' })
    res.json(grade)
}


//post
const createGrade = async (req, res) => {
    const { mark, student, course, level } = req.body
    if (mark === undefined || mark === null)
        return res.status(400).json({ message: 'Mark is required' })
    if (mark < 0 || mark > 100)
        return res.status(400).json({ message: 'Mark must be at 0-100 range' })
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

    if (!_id)
        return res.status(400).json({ message: '_id is required' })

    const grade = await Grade.findById(_id).exec()
    if (!grade)
        return res.status(400).json({ message: 'Grade is not found' })

    if (mark) {
        if (mark < 0 || mark > 100)
            return res.status(400).json({ message: 'Mark must be at 0-100 range' })
        grade.mark = mark
    }
    if (student)
        grade.student = student
    if (course)
        grade.course = course
    if (level)
        grade.level = level

    const updatedGrade = await grade.save()
    res.json(`'${updatedGrade.mark}' '${updatedGrade.student}' '${updatedGrade.course}' '${updatedGrade.level}' is updated`)
}


// //delete
// const deleteGrade = async (req, res) => {
//     const { _id } = req.paramas
//     const grade = await Grade.findById(_id).exec()
//     if (!grade) {
//         return res.status(400).json({ message: 'grade is not found' })
//     }
//     const result = await grade.deleteOne()
//     if (!result)
//         return res.status(400).json({ message: 'grade deletion has failed' })
//     res.json(`'grade  '${_id}' is deleted`)
// }
// Delete all grades for a student in a specific course
const deleteGradesByStudentAndCourse = async (req, res) => {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
        return res.status(400).json({ message: 'Student ID and Course ID are required' });
    }

    try {
        const result = await Grade.deleteMany({ student: studentId, course: courseId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No grades found for this student in the course' });
        }
        res.json({ message: `Deleted ${result.deletedCount} grades for student ${studentId} in course ${courseId}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete grades' });
    }
};

module.exports = {
    getAllGrades,
    getAllStudentGrades,
    getGradeByStudentAndLevel,
    getGradeById,
    createGrade,
    updateGrade,
    // deleteGrade
    deleteGradesByStudentAndCourse
}

