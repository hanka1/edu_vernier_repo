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
//const x = canvas.width / 2
//const y = canvas.height / 2


let gdxDevice
let animation_id
let score = 0
let i = 0

let dock = new Dock (canvas.width/2 + 150, canvas.height/2 - 150, 100, 40, 'rgb(200, 231, 240)' )
let dock_doors = new Dock_door (canvas.width/2 + 150, canvas.height/2 - 150, 40, 'black' )
let ship = new Ship(canvas.width / 2, canvas.height / 2, 500)
let guide = true

let particles = []
let asteroids = []

//to restart game properties
function init () {
    dock = new Dock (canvas.width - 150, canvas.height - 350, 100, 40, 'rgb(200, 231, 240)' )
    dock_doors = new Dock_door (canvas.width - 150, canvas.height - 350, 40, 'black' )
    ship = new Ship(canvas.width / 2, canvas.height / 2, 500)

    for (let j = 0; j < 4; j++) {
        let asteroid = new Asteroid(
            Math.random() * c.canvas.width,
            Math.random() * c.canvas.height,
            1000 + Math.random() * 8000
        )
        asteroid.push(Math.random() * 2 * Math.PI, 2000, 60)//to push asteroid to move
        asteroid.twist((Math.random()-0.5) * 500, 60)
        asteroids.push(asteroid) //to add asteroit to asterois array
    }

    score = 0
    scoreEl.innerHTML = score
    scoreTotalEl.innerHTML = score
}

let previous
function animate(timestamp) {
    try {

        if (!previous) 
            previous = timestamp
        let elapsed = timestamp - previous
        c.clearRect(0, 0, c.canvas.width, c.canvas.height)
        update(elapsed/1000)
        draw(c)
        previous = timestamp

        if ( i > 12 ) {
            //TODO
            gdxDevice.close()	
        
            output.textContent += ("GAME OVER")
            cancelAnimationFrame(animation_id)
            if (gdxDevice)
            i = 11    
        }

        animation_id = window.requestAnimationFrame(animate)

    } catch (err) {
        console.log(err)
        output.textContent += (err.toString())
        output.textContent += ('Try to reload page and/or switch off / switch on device.')
    }
}
window.requestAnimationFrame(animate)

c.canvas.addEventListener("keydown", (e) => {
    key_handler(e, true)
}, true)
   
c.canvas.addEventListener("keyup", (e) => {
    key_handler(e, false)
}, true)

/*

function animate () {
    try {
        animation_id = requestAnimationFrame(animate)

        c.fillStyle = 'rgb(0, 0, 0)' //to se a shadow behind moving objects
        c.fillRect(0 , 0, canvas.width, canvas.height) //to clean canvas and delete old game
   
        dock.draw() 
        dock_doors.draw() 
        //ship.update() 



    } catch (err) {
        console.log(err)
        output.textContent += (err.toString())
        output.textContent += ('Try to reload page and/or switch off / switch on device.')
    }
}
*/

function updateShip (sensor_values) {
    try {

        //TODO
        //rocket.update() 

        console.log(sensor_values)

    } catch (err) {
        console.log(err)
    }
}

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

function update(elapsed) {
    //ship.compromised = false
    asteroids.forEach(function(asteroid) {
        asteroid.update(elapsed, c)
        if (collision (asteroid, ship)) 
            ship.compromised = true
        //else
            //ship.compromised = false
    })
    ship.update(elapsed, c)
}