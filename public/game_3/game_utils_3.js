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

let gdxDevice
let animation_id
let score = 0
let i = 0

let particles = []
let asteroids = []

let ship = new Ship(canvas.width / 2, canvas.height / 2, 0.1)
let guide = false
let mySound = new sound("../sounds/crash.mp3");

//to restart game properties
function init () {
    dock = new Dock (canvas.width - 150, canvas.height - 350, 100, 70, 'rgb(200, 231, 240)' )
    dock_doors = new Dock_door (canvas.width - 150, canvas.height - 350, 70, 'black' )
    ship = new Ship(canvas.width / 2, canvas.height / 2, 0.1)

    for (let j = 0; j < 2; j++) {
        let asteroid = new Asteroid(
            Math.random() * c.canvas.width,
            Math.random() * c.canvas.height,
            200 + Math.random() * 1000
        )
        //asteroid.push(Math.random() * 2 * Math.PI, 400, 60)//to push asteroid to move
        //asteroid.twist((Math.random()-0.5) * 200, 60)
        asteroids.push(asteroid) //to add asteroit to asterois array
    }
    
    score = 0
    scoreEl.innerHTML = score
    scoreTotalEl.innerHTML = score
}

function animate(timestamp) {
    try {
        animation_id = requestAnimationFrame(animate)
        c.clearRect(0, 0, c.canvas.width, c.canvas.height)
        update()
        draw(c)
        //todo time or health measuring for score
        if ( i > 12000 ) {
            //TODO
            gdxDevice.close()	
        
            output.textContent += ("GAME OVER")
            cancelAnimationFrame(animation_id)
        }
 
    } catch (err) {
        console.log(err)
        output.textContent += (err.toString())
        output.textContent += ('Try to reload page and/or switch off / switch on device.')
    }
}

//for testing and dev only
c.canvas.addEventListener("keydown", (e) => {
    key_handler(e, true)
}, true)
   
c.canvas.addEventListener("keyup", (e) => {
    key_handler(e, false)
}, true)

function draw() {
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

}

//todo collisions, score, time measuring
function update(){
    //ship.compromised = false
    if (ship.in_dock){
        //todo end of game WIN
        ship.up_thruster = false; ship.down_thruster = false; 
        ship.right_thruster = false; ship.left_thruster = false; 
        setTimeout(() => {
            cancelAnimationFrame(animation_id) 
            modelEl.hidden = false
            scoreTotalEl.innerHTML = score
            if (gdxDevice)
            gdxDevice.close()
        }, 2000)
	
        output.textContent += ("GAME OVER. YOU WIN!")
        cancelAnimationFrame(animation_id)
    }
    console.log(ship.in_dock)

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

}