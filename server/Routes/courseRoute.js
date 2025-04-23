const express = require("express")
const router = express.Router()
const courseController = require("../Controllers/courseController")
const verifyJWT =require('../middleware/verifyJWT')

//get
router.get("/", courseController.getAllCourses)

//getById
router.get("/:_id", courseController.getCourseById)

//post
router.post("/", courseController.createCourse)

//put
router.put("/", courseController.updateCourse)

//delete
router.delete("/:_id", courseController.deleteCourse)


module.exports = router




