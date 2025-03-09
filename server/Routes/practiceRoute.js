const express = require("express")
const router = express.Router()
const practiceController = require("../Controllers/practiceController")


//get
 router.get("/", practiceController.getAllPractices)

//getById
router.get("/:_id", practiceController.getPracticeById)

//post
router.post("/", practiceController.createPractice)

//put
router.put("/", practiceController.updatePractice)

//delete
router.delete("/:_id", practiceController.deletePractice)


module.exports = router




