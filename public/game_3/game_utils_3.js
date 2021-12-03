const canvas = document.querySelector('canvas')
const scoreEl = document.querySelector('#scoreEl')
const scoreTotalEl = document.querySelector('#scoreTotalEl')
const divCanvasGame = document.querySelector('#div_canvas_game')

divCanvasGame.style.maxWidth = CANVAS_WIDTH + 'px'
divCanvasGame.style.backgroundColor = "black"

canvas.height = CANVAS_HEIGHT
canvas.width = CANVAS_WIDTH
const c = canvas.getContext('2d')

let animation_id
let score = 0
let i = 0

let particles = []
let asteroids = []
let ship
let guide = false
let mySound = new Sound("../sounds/crash.mp3");

function draw() {
    try{
        c.clearRect(0, 0, c.canvas.width, c.canvas.height)
        dock.draw(c) 
        dock_doors.draw(c) 

        if (guide)
            draw_grid(c)

        asteroids.forEach((asteroid)=>{
            asteroid.draw(c, guide)
            if (guide)
                draw_line(c, asteroid, ship)
        })

        ship.draw(c, guide)
        //health_indicator.draw(c, ship.health, ship.max_health)
        
    } catch (err) {
        console.log(err)
    }
}

//todo collisions, score, time measuring
function update(){
    try{
        //ship.compromised = false
        if (ship.in_dock){
            output.textContent += ("YOU WIN!\n")
            gameOver()
        }

        for (let i = 0; i < asteroids.length; i++){
            
            //ship collision
            if (collision (asteroids[i], ship)) {
                //ship.compromised = true
                //todo
            }

            //asteroids collision
            for (let j = 0; j < asteroids.length; j++){
        
                if (collision (asteroids[i], asteroids[j]) && asteroids[i] != asteroids[j]) {
                    //todo
                    asteroids[j].update(c)
                }
            }
            asteroids[i].update(c)


        }
        ship.update(c)
        
    } catch (err) {
        console.log(err)
    }
}

//todo solve sensor values
function updateShipThrusters (sensor_values) {
    try {
        i++ //i for testing and developmnet only
        if (sensor_values.x < -2)
            return
        
        if (sensor_values.z > 0)
            updateEachThruster(sensor_values.z, 'up_thruster')
        else
            updateEachThruster( - sensor_values.z, 'down_thruster')

        if (sensor_values.y > 0)
            updateEachThruster(sensor_values.y, 'right_thruster')
        else
            updateEachThruster( - sensor_values.y, 'left_thruster')

    } catch (err) {
        console.log(err)
    }
}

function updateEachThruster (sensor_value, thruster) {
    try {

        if (sensor_value > 3.5 && sensor_value < 6.5){
            ship[thruster] = 1
            setTimeout(() => { ship[thruster] = false }, 300)
        }

        if (sensor_value > 6.5 && sensor_value < 8.5){
            ship[thruster] = 2
            setTimeout(() => { ship[thruster] = false }, 600)
        }

        if (sensor_value > 8.5){
            ship[thruster] = 3
            setTimeout(() => { ship[thruster] = false }, 900)
        }

    } catch (err) {
        console.log(err)
    }
}