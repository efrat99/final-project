const User = require("../Models/userModel")

//getAllUsers
const getAllUsers = async (req, res) => {
    const Users = await User.find().lean()
    if (!Users?.length) {
        return res.status(400).json({ message: 'There are no Users' })
    }
    res.json(Users)
}

//getById
const getUserById = async (req, res) => {
    const { _id } = req.params
    const user = await User.findById(_id).exec()
    if (!user) {
        return res.status(400).json({ message: 'user is not found' })
    }
    res.json(user)
}

//post
// const createUser = async (req, res) => {
//     const { firstName, lastName, email, phone, password} = req.body
//     if (!firstName)
//         return res.status(400).json({ message: 'firstName is required' })
//     if (firstName.length < 2)
//         return res.status(400).json({ message: 'firstName must be at least two chars long' })
//     if (!lastName)
//         return res.status(400).json({ message: 'lastName is required' })
//     if (lastName.length < 2)
//         return res.status(400).json({ message: 'lastName must be at least two chars long' })
//     if (!email)
//         return res.status(400).json({ message: 'email is required' })
//     if(!password)
//         return res.status(400).json({ message: 'email is required' })

//     const emailExists = await User.findOne({ email: email }).exec();
//     if (emailExists)
//         return res.status(400).json({ message: 'This email is already in use. Please choose another one' })
    
//     try {
//     const User = await User.create({ firstName, lastName, email, phone, password })
//     if (User) {
//         res.json(User)//.status(201).json({message: 'Post is created successfully'})
//     }
//     else {
//         res.status(400).json({ message: 'Creation has failed' })
//     }
//     } catch (e) {
//         res.status(500).json({ message: 'Internal server error', error: error.message })
//     }
// }

//put
const updateUser = async (req, res) => {

    const { _id, firstName, lastName, phone } = req.body
    if (!_id)
        return res.status(400).json({ message: 'id is required' })

    const user = await User.findById(_id).exec()
    if (!user) 
        return res.status(400).json({ messege: 'user is not found' })

    if (firstName) {
        if (firstName.length < 2)
            return res.status(400).json({ message: 'firstName must be at least two chars long' })
        user.firstName = firstName
    }
    if (lastName) {
        if (lastName.length < 2)
            return res.status(400).json({ message: 'lastName must be at least two chars long' })
        user.lastName = lastName
    }
    if (phone)
        user.phone = phone

    const updatedUser = await user.save()

    res.json(`'${updatedUser.firstName}' '${updatedUser.lastName}' is updated`)
}

//delete
const deleteUser = async (req, res) => {//req params????
    const { _id } = req.params
    const user = await User.findById(_id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User is not found' })
    }
    const result = await user.deleteOne()
    const reply = `User '${_id}' is deleted`
    res.json(reply)
}


module.exports = {
    getAllUsers,
    getUserById,
    // createTeacher,
    updateUser,
    deleteUser
}