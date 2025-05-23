const express = require("express")
const router = express.Router()
const gradeController = require("../Controllers/gradeController")


//get
// router.get("/", gradeController.getAllGrades)

//getById
router.get("/:_id", gradeController.getGradeById)

//get all student's grades
router.get("/student/:_id", gradeController.getAllStudentGrades)

//get Grade By Student And Level
router.get("/", gradeController.getGradeByStudentAndLevel)

//post
router.post("/", gradeController.createGrade)

//put
router.put("/", gradeController.updateGrade)

// delete
// router.delete("/:_id", gradeController.deleteGrade)
router.delete('/deleteByStudentAndCourse', gradeController.deleteGradesByStudentAndCourse);

module.exports = router




