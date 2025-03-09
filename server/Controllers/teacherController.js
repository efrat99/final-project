const Teacher = require("../Models/teacherModel")

//getAllTeachers
const getAllTeachers= async (req, res) => {
    const Teachers = await Teacher.find().lean()
    if (!Teachers?.length) {
        return res.status(400).json({ message: 'There are no teachers' })
    }
    res.json(Teachers)
}

//getById
const getTeacherById=async(req,res)=>{
     const {_id} = req.params
    const teacher=await Teacher.findById(_id).exec()
    if(!teacher){
        return res.status(400).json({ message:'teacher is not found' }) 
    }
    res.json(teacher)
}

//post
const createTeacher = async (req, res) => {
    const { firstName, lastName,email,phone } = req.body
    if (!firstName)
        return res.status(400).json({ message: 'firstName is required' })
    if (!lastName)
        return res.status(400).json({ message: 'lastName is required' })
    if (!email)
        return res.status(400).json({ message: 'email is required' })

    const teacher = await Teacher.create({ firstName, lastName,email,phone })
    if (teacher) {
        res.json(teacher)//.status(201).json({message: 'Post is created successfully'})
    }
    else {
        res.status(400).json({ message: 'Invalid creation' })
    }
}

//put
const updateTeacher = async (req, res) => {
    const { _id, firstName, lastName,email,phone } = req.body
    if (!_id)
        return res.status(400).json({ message: 'id is required' })

    const teacher = await Teacher.findById(_id).exec()
    if (!teacher) {
        return res.status(400).json({ messege: 'teacher is not found' })
    }
    if(firstName)
    teacher.firstName=firstName
    if(lastName)
    teacher.lastName=lastName
    if(email)  
    teacher.email=email//unique
    if(phone)
    teacher.phone=phone
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