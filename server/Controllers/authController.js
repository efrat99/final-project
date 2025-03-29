const bcrypt = require('bcrypt')
const Teacher = require("../Models/teacherModel")

const login = async (req, res) => {

}
const register = async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body
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
    if (!password)
        return res.status(400).json({ message: 'email is required' })

    const emailExists = await Teacher.findOne({ email: email }).exec();
    if (emailExists)
        return res.status(400).json({ message: 'This email is already in use. Please choose another one' })


    const hashedPwd = await bcrypt.hash(password, 10)
    const teacherObject = { firstName, lastName, email, phone, password: hashedPwd }
    try {
        const teacher = await Teacher.create({ firstName, lastName, email, phone, password: hashedPwd })
        if (teacher) {
            res.json(teacher)
        }
        else {
            res.status(400).json({ message: 'Creation has failed' })
        }
    } catch (e) {
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}
module.exports = { login, register }