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
let i = 0 //for testing and development only

let particles = []
let asteroids = []
let ship
let touch_sound = new Sound(WALL_HIT_SOUND_1)
let ship_crash_sound = new Sound(SHIP_CRASH_SOUND)
let ship_win_sound =  new Sound(SHIP_WIN_SOUND)
let ship_out_of_fuel_sound  = new Sound(SHIP_OUT_OF_FUEL)
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

function update(){
    try{
        animateParticles()
        if (ship.in_dock){
            ship_win_sound.play()
            scoreTotalEl.innerHTML = "YOU WIN !"
            output.textContent += ("YOU WIN!\n")
            gameOver()
        }

        if (ship.fuel <= 0 ){
            ship_out_of_fuel_sound.play()
            scoreTotalEl.innerHTML = "SHIP OUT OF FUEL !"
            output.textContent += ("SHIP OUT OF FUEL!\n")
            gameOver()
        }

        for (let i = 0; i < asteroids.length; i++){
            
            //ship collision
            if (collision (asteroids[i], ship) && !ship.in_dock) {
                ship.crashed = true

                //push ship and asteriod after collision
                solveCollision(asteroids[i], ship)

                if(!ship_collision){
                    endGameEffect()
                    setTimeout(() => { 
                        scoreTotalEl.innerHTML = "SHIP CRASHED !"
                        output.textContent += ("SHIP CRASHED!\n")
                        gameOver()
                    }, 3000)

                }
                
                ship_collision = true
            }

            //asteroids collision
            for (let j = 0; j < asteroids.length; j++){
  
                if (
                    asteroids[i].id != asteroids[j].id && 
                    collision (asteroids[i], asteroids[j]) && 
                    ! asteroids[i].collision_set.has(asteroids[j].id) &&
                    ! asteroids[j].collision_set.has(asteroids[i].id)) {

                    //push asteriods after collision
                    solveCollision(asteroids[i], asteroids[j])
           
                    //to save that collision exists 
                    asteroids[i].collision_set.add(asteroids[j].id)
                    asteroids[j].collision_set.add(asteroids[i].id)

                    //to set that collision is not any more - to withdraw from set
                    setTimeout(()=>{
                        asteroids[i].collision_set.delete(asteroids[j].id)
                        asteroids[j].collision_set.delete(asteroids[i].id)
                    }, 1000)
                }
            }
            asteroids[i].update(c)
        }
        ship.update(c)
        
    } catch (err) {
        console.log(err)
    }
}

function solveCollision (obj1, obj2) {
    try {

        let vector_collision = {
            x: obj2.x - obj1.x, 
            y: obj2.y - obj1.y}
        let vector_collision_distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y))
        //to calculate collision direction
        let vector_normalized_collision = {
            x: vector_collision.x / vector_collision_distance, 
            y: vector_collision.y / vector_collision_distance 
        }
        //vector relative velocity of the objects, like the vector if one of the objects is stationary
        let vector_relative_speed = {
            x: obj1.x_speed - obj2.x_speed, 
            y: obj1.y_speed - obj2.y_speed 
        }
        //speed of the collision
        let speed = vector_relative_speed.x * vector_normalized_collision.x + vector_relative_speed.y * vector_normalized_collision.y

        if (speed < 0) {
            return
        }

        //the collision impulse
        let impulse = 2 * speed / (obj1.mass + obj2.mass)

        obj1.x_speed -= impulse * obj2.mass * vector_normalized_collision.x
        obj1.y_speed -= impulse * obj2.mass * vector_normalized_collision.y
        obj2.x_speed += impulse * obj1.mass * vector_normalized_collision.x
        obj2.y_speed += impulse * obj1.mass * vector_normalized_collision.y

    } catch (err) {
        console.log(err)
    }
}


//to solve sensor values
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
        if (CONFIG_OWN_ASTEROID)
            ASTEROIDS_TOTAL = ASTEROIDS_ARRAY.length

        let i = 0
        while ( i < ASTEROIDS_TOTAL ) {

            let size = CONFIG_OWN_ASTEROID ? ASTEROIDS_ARRAY[i].size : ASTEROIDS_SIZE + Math.random() * ASTEROIDS_SIZE * 5
            let force = CONFIG_OWN_ASTEROID ? ASTEROIDS_ARRAY[i].force : PUSH_ASTEROID_FORCE

            let x = Math.random() * c.canvas.width
            let y = Math.random() * c.canvas.height
            let movement_angle = Math.random() * 2 * Math.PI
            let radius = Math.sqrt( size / Math.PI)
            
            //not to spawn near the border or dock or ship
            if ( x < 2 * radius || y < 2 * radius 
                ||
                x > c.canvas.width - 2 * radius || y > c.canvas.height - 2 * radius 
                ||
                ( x > dock.x - 2 * radius && x < dock.x + dock.width + 2 * radius && 
                  y > dock.y - 2 * radius && y < dock.y + dock.height + 2 * radius )
                ||
                ( x > c.canvas.width / 2 - 3 * radius && x < c.canvas.width / 2 + 3 * radius &&
                  y > c.canvas.height / 2 - 3 * radius && y < c.canvas.height / 2 + 3 * radius )
            )
                continue
            let asteroid = new Asteroid(x, y, size)

            //to push asteroid to move
            asteroid.push(movement_angle, force)

            //asteroid.twist((Math.random()-0.5) * 200, 60)
            asteroids.push(asteroid) //to add asteroit to asterois array
            i++
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