const express = require("express")
const router = express.Router()
const studentController = require("../Controllers/studentController")


//get
router.get("/", studentController.getAllStudent)

//getById
router.get("/:_id", studentController.getStudentById)

//post
router.post("/", studentController.createStudent)

//put
router.put("/", studentController.updateStudent)

//delete
router.delete("/:_id", studentController.deleteStudent)
 

module.exports = router