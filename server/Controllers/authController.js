const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require("../Models/userModel")


const login = async (req, res) => {
    const { email, password } = req.body
    if (!email)
        return res.status(400).json({ message: 'email is required' })
    if (!password)
        return res.status(400).json({ message: 'password is required' })

    const user = await User.findOne({ email: email }).lean()
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) 
        res.status(401).json({ message: 'Unauthorized' })
       // const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
   // const teacherInfo = { _id: teacher._id, firstName: teacher.firstName, lastName: teacher.lastName, email: teacher.email, phone: teacher.phone }
    const userInfo = { email: user.email,role:user.userType }
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    console.log(userInfo)
    res.json({accessToken:accessToken,userInfo:userInfo})

}



const register = async (req, res) => {
    const { firstName, lastName, email, phone, password, userType } = req.body
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
        return res.status(400).json({ message: 'password is required' })
    if (!userType)
        return res.status(400).json({ message: 'userType is required' })
    const emailExists = await User.findOne({ email: email }).exec();
    if (emailExists)
        return res.status(400).json({ message: 'This email is already in use. Please choose another one' })


    const hashedPwd = await bcrypt.hash(password, 10)
    const userObject = { firstName, lastName, email, phone, password: hashedPwd,userType }
    try {
        const user = await User.create({ firstName, lastName, email, phone, password: hashedPwd,userType })
        if (user) {
            res.json(user)
        }
        else {
            res.status(400).json({ message: 'Creation has failed' })
        }
    } catch (e) {
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}
module.exports = { login, register }