import express from "express"
import path from "path"

const app = express()
const PORT = 8000
const __dirname = path.resolve()

app.use(express.static(__dirname + '/public'))

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, './public/router.html' ))
})

app.get("/game_1", (req,res) => {
    res.sendFile(path.join(__dirname, './public/game_1/game_1.html' ))
})

app.get("/game_2", (req,res) => {
    res.sendFile(path.join(__dirname, './public/game_2/game_2.html' ))
})

app.get("/game_3", (req,res) => {
    res.sendFile(path.join(__dirname, './public/game_3/game_3.html' ))
})


app.get("/game_4", (req,res) => {
    res.sendFile(path.join(__dirname, './public/game_4/game_4.html' ))
})

app.get("/test", (req,res) => {
    res.sendFile(path.join(__dirname, './public/test/test.html' ))
})

app.get("/acceleration_sensors.html", (req,res) => {
    res.sendFile(path.join(__dirname, './public/charts/acceleration_sensors.html'  ))
})


app.get("/start", (req,res) => {
    res.sendFile(path.join(__dirname, './public/charts/start.html' ))
})

app.get("/example", (req,res) => {
    res.sendFile(path.join(__dirname, './public/example.html' ))
})

app.listen(PORT,()=>{
    console.log("Server is running at Port " + PORT)
})

//orginals from Vernier
app.get("/chart_Vernier", (req,res) => {
    res.sendFile(path.join(__dirname, './public/vernier_original/chart_Vernier.html'  ))
})

app.get("/two_sensors", (req,res) => {
    res.sendFile(path.join(__dirname, './public/vernier_original/two_sensors.html'  ))
})