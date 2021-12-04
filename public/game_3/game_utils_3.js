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
let touch_sound = new Sound(CRASH_SOUND_1)
let ship_crash_sound = new Sound(SHIP_CRASH_SOUND)
let ship_win_sound =  new Sound(SHIP_WIN_SOUND)
let fuel_indicator = new Indicator( 45, 12, 120, 12)
let ship_collision = false
let endGameEffectInterval 

function draw() {
    try{
        c.clearRect(0, 0, c.canvas.width, c.canvas.height)
        dock.draw(c) 

        if (guide)
            drawGrid(c)

        asteroids.forEach((asteroid)=>{
            asteroid.draw(c, guide)
            if (guide)
                drawLine(c, asteroid, ship)
        })

        ship.draw(c, guide)
        fuel_indicator.draw(c, ship.fuel, ship.max_fuel)

        particles.forEach((particle, particle_index) => {
                particle.draw()
        })
        
    } catch (err) {
        console.log(err)
    }
}

//todo collisions, score, time measuring
function update(){
    try{
        animateParticles()
        //ship.compromised = false
        if (ship.in_dock){
            ship_win_sound.play()
            output.textContent += ("YOU WIN!\n")

            gameOver()
        }

        if (ship.fuel <= 0 ){
            output.textContent += ("SHIP OUT OF FUEL!\n")
            gameOver()
        }

        for (let i = 0; i < asteroids.length; i++){
            
            //ship collision
            if (collision (asteroids[i], ship) && !ship_collision && !ship.in_dock) {
                ship_collision = true
                ship.crashed = true

                endGameEffect()
                setTimeout(() => { 
                    output.textContent += ("SHIP CRASHED!\n")
                    gameOver()
                }, 3000)

                
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

function endGameEffect() {
    try {  
        ship_crash_sound.play() 

        let color_array = ["yellow", "orange", "red"]
        endGameEffectInterval = setInterval(() => {
                color_array.forEach((color) => {
                    particles.push(
                        new Particle(ship.x, ship.y, 
                            Math.random() * 3, 
                            color, 
                            { 
                                x:  ( ship.x * (Math.random() - 0.5) / 100),  //how big and which direction particles flies
                                y:  ( ship.y * (Math.random() - 0.5) / 100) 
                            }
                        )
                    )
                })
      
        }, 40) //each 60 ms

    } catch (err) {
        console.log(err)
    }
}

function createParticles() {
    try {  
        // to create particles after projectile hits the enemy
        for (let i = 0; i < enemy.radius * 2; i++){
            particles.push(
                new Particle(projectile.x + BODY_MARGIN , projectile.y + BODY_MARGIN, 
                    Math.random() * 2, 
                    enemy.color, 
                    { 
                        x: (Math.random() - 0.5) * Math.random() * 5, //how big and random direction particles flies
                        y: (Math.random() - 0.5) * Math.random() * 5
                    }
                )
            )
        }  
    } catch (err) {
        console.log(err)
    }
}

function animateParticles () {
    try { 

        particles.forEach((particle, particle_index) => {
            if (particle.alpha <= 0){
                particles.splice(particle_index, 1) //remove particle
            } else {
                particle.update()
                console.log()
            }
        })
        
    } catch (err) {
        console.log(err)
    }
}