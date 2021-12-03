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
let guide = GUIDE_LINES
let mySound = new Sound(CRASH_SOUND_1)
let fuel_indicator = new Indicator( 45, 12, 120, 12)

function draw() {
    try{
        c.clearRect(0, 0, c.canvas.width, c.canvas.height)
        dock.draw(c) 

        if (guide)
            draw_grid(c)

        asteroids.forEach((asteroid)=>{
            asteroid.draw(c, guide)
            if (guide)
                draw_line(c, asteroid, ship)
        })

        ship.draw(c, guide)
        fuel_indicator.draw(c, ship.fuel, ship.max_fuel)
        
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

        if (ship.fuel <= 0 ){
            output.textContent += ("SHIP OUT OF FUEL!\n")
            gameOver()
        }

        for (let i = 0; i < asteroids.length; i++){
            
            //ship collision
            if (collision (asteroids[i], ship)) {
                //todo
            }

            //asteroids collision
            for (let j = 0; j < asteroids.length; j++){
        
                if (collision (asteroids[i], asteroids[j]) && asteroids[i] != asteroids[j]) {
                    //todo
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
        i++ //i for testing and development only
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

        if (sensor_value > THRUSTER_LIMIT_1 && sensor_value <= THRUSTER_LIMIT_2){
            ship[thruster] = 1
            ship.fuel -= 1
            setTimeout(() => { ship[thruster] = false }, 300)
        }

        if (sensor_value > THRUSTER_LIMIT_2 && sensor_value <= THRUSTER_LIMIT_3){
            ship[thruster] = 2
            ship.fuel -= 2
            setTimeout(() => { ship[thruster] = false }, 600)
        }

        if (sensor_value > THRUSTER_LIMIT_3){
            ship[thruster] = 3
            ship.fuel -= 3
            setTimeout(() => { ship[thruster] = false }, 900)
        }

    } catch (err) {
        console.log(err)
    }
}

function spawnAsteroids() {
    try {
        let i = 0
        while ( i < ASTEROIDS_TOTAL ) {

            let size = ASTEROIDS_SIZE + Math.random() * ASTEROIDS_SIZE * 5

            let radius = Math.sqrt( size / Math.PI)
            let x = Math.random() * c.canvas.width
            let y = Math.random() * c.canvas.height

            //not to spawn near the border or dock
            if ( x < 2 * radius || y < 2 * radius 
                ||
                x > c.canvas.width - 2 * radius || y > c.canvas.height - 2 * radius 
                ||
                ( x > dock.x - 2 * radius && x < dock.x + dock.width + 2 * radius && 
                  y > dock.y - 2 * radius && y < dock.y + dock.height + 2 * radius )
            )
                continue

            i++
            let asteroid = new Asteroid(x, y, size)
            asteroid.push(Math.random() * 2 * Math.PI, PUSH_ASTEROID_FORCE)//to push asteroid to move
            //asteroid.twist((Math.random()-0.5) * 200, 60)
            asteroids.push(asteroid) //to add asteroit to asterois array
        }

    } catch (err) {
        console.log(err)
    }
}