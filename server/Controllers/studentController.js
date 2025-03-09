const Student = require("../Models/studentModel")

//getAllStudents
const getAllStudent= async (req, res) => {
    const students = await Student.find().lean()
    if (!students?.length) {
        return res.status(400).json({ message: 'There are no students' })
    }
    res.json(students)
}

//getById
const getStudentById=async(req,res)=>{
     const {_id} = req.params
    const student=await Student.findById(_id).exec()
    if(!student){
        return res.status(400).json({ message:'student is not found' }) 
    }
    res.json(student)
}

//post
const createStudent = async (req, res) => {
    const { firstName, lastName,email,phone } = req.body
    if (!firstName)
        return res.status(400).json({ message: 'firstName is required' })
    if (!lastName)
        return res.status(400).json({ message: 'lastName is required' })
    if (!email)
        return res.status(400).json({ message: 'email is required' })

    const student = await Student.create({ firstName, lastName,email,phone })
    if (student) {
        res.json(student)//.status(201).json({message: 'Post is created successfully'})
    }
    else {
        res.status(400).json({ message: 'Invalid creation' })
    }
}

//put
const updateStudent= async (req, res) => {
    const { _id, firstName, lastName,email,phone } = req.body
    if (!_id)
        return res.status(400).json({ message: 'id is required' })

    const student = await Student.findById(_id).exec()
    if (!student) {
        return res.status(400).json({ messege: 'student is not found' })
    }
    if(firstName)
    student.firstName=firstName
    if(lastName)    
    student.lastName=lastName
    if(email)
    student.email=email
    if(phone)
    student.phone=phone

    const updatedStudent = await student.save()

    res.json(`'${updatedStudent.firstName}' '${updatedStudent.lastName}' is updated`)
}

//delete
const deleteStudent = async (req, res) => {
    const { _id } = req.params
    const student = await Student.findById(_id).exec()
    if (!student) {
        return res.status(400).json({ message: 'Student is not found' })
    }
    const result = await student.deleteOne()
    const reply = `Student '${_id}' is deleted`
    res.json(reply)
}


module.exports = {
    getAllStudent,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
}