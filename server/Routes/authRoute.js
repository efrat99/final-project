const express = require("express")
const verifyJWT = require("../middleware/verifyJWT")
const router = express.Router()
const authController = require("../Controllers/authController")


router.post("/login", authController.login)
router.post("/", authController.register)

module.exports = router