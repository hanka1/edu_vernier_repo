import express from "express"
import path from "path"

const app = express()
const PORT = 8000
const __dirname = path.resolve()

app.use(express.static(__dirname + '/public'));

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, './public/router.html' ))
})

app.get("/game_1", (req,res) => {
    res.sendFile(path.join(__dirname, './public/game_1.html' ))
})

app.get("/acceleration_sensors.html", (req,res) => {
    res.sendFile(path.join(__dirname, './public/acceleration_sensors.html'  ))
})

app.get("/chart_Vernier", (req,res) => {
    res.sendFile(path.join(__dirname, './public/chart_Vernier.html'  ))
})

app.get("/example", (req,res) => {
    res.sendFile(path.join(__dirname, './public/example.html' ))
})

app.listen(PORT,()=>{
    console.log("Server is running at Port " + PORT)
})