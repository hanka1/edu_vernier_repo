const canvas = document.querySelector('canvas')
const scoreEl = document.querySelector('#scoreEl')
const startGameBtn = document.querySelector('#startGameBtn')
const modelEl = document.querySelector('#modelEl')
const scoreTotalEl = document.querySelector('#scoreTotalEl')
const divCanvasGame = document.querySelector('#div_canvas_game')

divCanvasGame.style.maxWidth = CANVAS_WIDTH + 'px'
divCanvasGame.style.backgroundColor = "black"

canvas.height = CANVAS_HEIGHT
canvas.width = CANVAS_WIDTH

const c = canvas.getContext('2d')

const x = canvas.width / 2
const y = canvas.height / 2
let dock = new Dock (canvas.width/2 + 150, canvas.height/2 - 150, 100, 40, 'rgb(200, 231, 240)' )
let rocket = new Rocket (50, canvas.height - 50, 10, 'red', {x: 0, y: 0})
let rocket2 = new Rocket (50, canvas.height - 50, 10, 'red', {x: 0, y: 0})
let dock_doors = new Dock_door (canvas.width/2 + 150, canvas.height/2 - 150, 40, 'black' )

let particles = []

let gdxDevice
let animation_id
let score = 0
let i = 0

//to restart game properties
function init () {
    dock = new Dock (canvas.width - 150, canvas.height - 350, 100, 40, 'rgb(200, 231, 240)' )
    rocket = new Rocket (50, canvas.height - 50, 10, 'red', {x: 0, y: 0})
    rocket2 = new Rocket (100, canvas.height - 100, 10, 'black', {x: 0, y: 0})
    dock_doors = new Dock_door (canvas.width - 150, canvas.height - 350, 40, 'black' )

    score = 0
    scoreEl.innerHTML = score
    scoreTotalEl.innerHTML = score
}

function animate () {
    try {
        animation_id = requestAnimationFrame(animate)

        c.fillStyle = 'rgb(0, 0, 0)' //to se a shadow behind moving objects
        c.fillRect(0 , 0, canvas.width, canvas.height) //to clean canvas and delete old game
   
        dock.draw() 
        rocket2.draw() 
        dock_doors.draw() 
        rocket2.update() 
        rocket.update() 

        if ( i > 63 ) {
            //TODO
            gdxDevice.close()	
            cancelAnimationFrame(animation_id)
            output.textContent += ("GAME OVER")
        }

    } catch (err) {
        console.log(err)
        output.textContent += (err.toString())
        output.textContent += ('Try to reload page and/or switch off / switch on device.')
    }
}

function moveRocket (sensor_values) {
    try {

        //TODO
        rocket.x += sensor_values.y, 
        rocket.y += sensor_values.z, 
        rocket.update() 

        console.log(sensor_values)

    } catch (err) {
        console.log(err)
    }
}