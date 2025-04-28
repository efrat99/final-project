const express = require("express")
const router = express.Router()
const learningController = require("../Controllers/learningController")


//get
//router.get("/", learningController.getAllLearnings)

//getById
router.get("/:_id", learningController.getLearningById)

//getByLevelObject
router.get("/", learningController.getLearningsByLevelObject)

//getLearningByLevelNumber
// router.get("/", learningController.getLearningByLevelNumber);


//post
router.post("/", learningController.createLearning)

//put
router.put("/", learningController.updatelearning)

//delete
router.delete("/:_id", learningController.deleteLearning)


module.exports = router