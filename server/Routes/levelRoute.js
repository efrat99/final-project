const express = require("express")
const router = express.Router()
const levelController = require("../Controllers/levelController")


// //get
router.get("/", levelController.getAllLevels)

//getById
router.get("/:_id", levelController.getLevelById)

//post
router.post("/", levelController.createLevel)

//put
router.put("/", levelController.updateLevel)

//delete
router.delete("/:_id", levelController.deleteLevel)


module.exports = router




