const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Teacher = require("../Models/teacherModel")


const login = async (req, res) => {
    const { email, password } = req.body
    if (!email)
        return res.status(400).json({ message: 'email is required' })
    if (!password)
        return res.status(400).json({ message: 'password is required' })

    const teacher = await Teacher.findOne({ email: email }).lean()
    if (!teacher) {
        debbugger
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const match = await bcrypt.compare(password, teacher.password)
    if (match) {
        res.json({ message: 'Login successful', teacher })
    } else {
        debbugger
        res.status(401).json({ message: 'Unauthorized' })
    }
    // const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    const teacherInfo = { _id: teacher._id, firstName: teacher.firstName, lastName: teacher.lastName, email: teacher.email, phone: teacher.phone }
    const accessToken = jwt.sign(teacherInfo, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken:accessToken})
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