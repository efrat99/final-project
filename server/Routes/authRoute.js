const express = require("express")
const verifyJWT = require("../middleware/verifyJWT")
const router = express.Router()
const authController = require("../Controllers/authController")


router.post("/login",verifyJWT, authController.login)
router.post("/",verifyJWT, authController.register)

module.exports = router