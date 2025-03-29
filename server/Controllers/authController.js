const bcrypt = require('bcrypt')
const Teacher = require("../Models/teacherModel")

const login = async (req, res) => {

}
const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    if (!firstName || !lastName || !email || !password) 
        return res.status(400).json({ message: 'All fields are required' })
    const duplicate = await Teacher.findOne({ email: email }).lean()
    if (duplicate) 
        return res.status(409).json({ message: "Duplicate email" })

    const hashedPwd = await bcrypt.hash(password, 10)
    const teacherObject = { firstName, lastName, email, phone, password: hashedPwd }
    const teacher = await Teacher.create(teacherObject)
    if (teacher) {
        return res.status(201).json({
            message: `New teacher ${teacher.email} created`
        })
       
    }
    else 
        return res.status(400).json({ message: 'Invalid teacher received' })
}
module.exports = { login, register }