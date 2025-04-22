const express = require("express")
const router = express.Router()
const userController = require("../Controllers/userController")


//get
router.get("/", userController.getAllUsers)

//getById
router.get("/:_id", userController.getUserById)

//post
// router.post("/", userController.createUser)

//put
router.put("/", userController.updateUser)

//delete
router.delete("/:_id", userController.deleteUser)


module.exports = router




