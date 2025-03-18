const Teacher = require("../Models/teacherModel")

//getAllTeachers
const getAllTeachers = async (req, res) => {
    const Teachers = await Teacher.find().lean()
    if (!Teachers?.length) {
        return res.status(400).json({ message: 'There are no teachers' })
    }
    res.json(Teachers)
}

//getById
const getTeacherById = async (req, res) => {
    const { _id } = req.params
    const teacher = await Teacher.findById(_id).exec()
    if (!teacher) {
        return res.status(400).json({ message: 'teacher is not found' })
    }
    res.json(teacher)
}

//post
const createTeacher = async (req, res) => {
    const { firstName, lastName, email, phone } = req.body
    if (!firstName)
        return res.status(400).json({ message: 'firstName is required' })
    if (firstName.length < 2)
        return res.status(400).json({ message: 'firstName must be at least two chars long' })
    if (!lastName)
        return res.status(400).json({ message: 'lastName is required' })
    if (lastName.length < 2)
        return res.status(400).json({ message: 'lastName must be at least two chars long' })
    if (!email)
        return res.status(400).json({ message: 'email is required' })
    const emailExists = await Teacher.findOne({ email: email }).exec();
    if (emailExists)
        return res.status(400).json({ message: 'This email is already in use. Please choose another one' })
    
    try {
    const teacher = await Teacher.create({ firstName, lastName, email, phone })
    if (teacher) {
        res.json(teacher)//.status(201).json({message: 'Post is created successfully'})
    }
    else {
        res.status(400).json({ message: 'Creation has failed' })
    }
    } catch (e) {
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

//put
const updateTeacher = async (req, res) => {
    const { _id, firstName, lastName, phone } = req.body
    if (!_id)
        return res.status(400).json({ message: 'id is required' })

    const teacher = await Teacher.findById(_id).exec()
    if (!teacher) 
        return res.status(400).json({ messege: 'teacher is not found' })

    if (firstName) {
        if (firstName.length < 2)
            return res.status(400).json({ message: 'firstName must be at least two chars long' })
        teacher.firstName = firstName
    }
    if (lastName) {
        if (lastName.length < 2)
            return res.status(400).json({ message: 'lastName must be at least two chars long' })
        teacher.lastName = lastName
    }
    if (phone)
        teacher.phone = phone

    const updatedTeacher = await teacher.save()

    res.json(`'${updatedTeacher.firstName}' '${updatedTeacher.lastName}' is updated`)
}

//delete
const deleteTeacher = async (req, res) => {//req params????
    const { _id } = req.params
    const teacher = await Teacher.findById(_id).exec()
    if (!teacher) {
        return res.status(400).json({ message: 'Teacher is not found' })
    }
    const result = await teacher.deleteOne()
    const reply = `Teacher '${_id}' is deleted`
    res.json(reply)
}


module.exports = {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
}