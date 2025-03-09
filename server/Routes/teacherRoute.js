const express = require("express")
const router = express.Router()
const teacherController = require("../Controllers/teacherController")


//get
router.get("/", teacherController.getAllTeachers)

//getById
router.get("/:_id", teacherController.getTeacherById)

//post
router.post("/", teacherController.createTeacher)

//put
router.put("/", teacherController.updateTeacher)

//delete
router.delete("/:_id", teacherController.deleteTeacher)


module.exports = router




