const Course = require("../Models/courseModel")

// getAllCourses
const getAllCourses = async (req, res) => {
    const courses = await Course.find().lean()
    if (!courses?.length) {
        return res.status(400).json({ message: 'There are no Courses' })
    }
    res.json(courses)
}

//getById
const getCourseById = async (req, res) => {
    const { _id } = req.params
    const course = await Course.findById(_id).exec()
    if (!course) {
        return res.status(400).json({ message: 'Course is not found' })
    }
    res.json(course)
}

//post
const createCourse = async (req, res) => {
    const { language, teacher, students, levels } = req.body
    if (!language)
        return res.status(400).json({ message: 'language  is required' })
    if (!teacher)
        return res.status(400).json({ message: 'teacher is required' })
    if (!students)
        return res.status(400).json({ message: 'students  is required' })
    if (!levels)
        return res.status(400).json({ message: 'levels is required' })

    const course = await Course.create({ language, teacher, students, levels })
    if (course) {
        res.json(course)//.status(201).json({message: 'Post is created successfully'})
    }
    else {
        res.status(400).json({ message: 'Invalid creation' })
    }
}

//put
const updateCourse = async (req, res) => {
    const { _id, language, teacher, students, levels } = req.body
    if (!_id)
        return res.status(400).json({ message: 'language  is required' })
    
    const course = await Course.findById(_id).exec()
    if (!course) {
        return res.status(400).json({ message: 'course is not found' })
    }
    if (language)
        course.language = language
    if (teacher)
        course.teacher = teacher
    if (students)
        course.students = students
    if (levels)
        course.levels = levels
    const updatedCourse = await course.save()
    res.json(`'${updatedCourse._id}' is updated`)
}

//delete
const deleteCourse = async (req, res) => {
    const { _id } = req.params
    const course = await Course.findById(_id).exec()
    if (!course) {
        return res.status(400).json({ message: 'Course is not found' })
    }
    const result = await course.deleteOne()
    const reply = `course '${_id}' is deleted`
    res.json(reply)
}


module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse

}