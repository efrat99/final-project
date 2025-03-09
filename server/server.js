
require("dotenv").config()
const express = require('express')
const cors = require("cors")
const corsOptions = require("./corsOptions")
const connectDB = require("./config/dbConn")
const { default: mongoose } = require("mongoose")
const PORT = process.env.PORT || 5001
const app = express()
connectDB()

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.static("public"))

// app.use("/userRoute", require("./Routes/usersRoute"))

app.use("/courses", require("./Routes/courseRoute"))
app.use("/grades", require("./Routes/gradeRoute"))
app.use("/learnings", require("./Routes/learningRoute"))
app.use("/levels", require("./Routes/levelRoute"))
app.use("/practices", require("./Routes/practiceRoute"))
app.use("/students", require("./Routes/studentRoute"))
app.use("/teachers", require("./Routes/teacherRoute"))


app.get('/', (req, res) => {
    res.send("Home Page!!")
})


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
})
mongoose.connection.on('error', err => {
    console.log(err)
})


//=========================================================================================
//notice:
//check the unique fields

