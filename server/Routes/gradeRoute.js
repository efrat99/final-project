const express = require("express")
const router = express.Router()
const gradeController = require("../Controllers/gradeController")


//get
router.get("/", gradeController.getAllGrades)

//getById
router.get("/:_id", gradeController.getGradeById)

//get all student's grades
router.get("/student/:_id", gradeController.getAllStudentGrades)

//post
router.post("/", gradeController.createGrade)

//put
router.put("/", gradeController.updateGrade)

// delete
// router.delete("/:_id", gradeController.deleteGrade)


module.exports = router




