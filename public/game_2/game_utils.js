const usbBtn = document.querySelector('#usb')
const usbLabel = document.querySelector('#usb_label')
const bleBtn = document.querySelector('#ble')
const bleLabel = document.querySelector('#ble_label')
const selectDeviceBtn = document.querySelector('#select_device')
const output = document.querySelector('#output')
const sensorArray = document.querySelector('#sensor_array')


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
let score_checker = 0 //to speed up enemy spawning
let spawn_enemy_interval

//to restart game properties
function init () {
    player = new Player(canvas.width/2, canvas.height/2 , 10, 'white')
    projectiles = []
    enemies = []
    particles = []
    score = 0
    scoreEl.innerHTML = score
    scoreTotalEl.innerHTML = score
}

function animateProjectils () {
    try {  
        projectiles.forEach((projectile, index_projectile) => {
            //to move projectile
            projectile.update() 

            //to remove projectils from screen edges
            if ( 
                projectile.x + projectile.radius < 0 ||
                projectile.x - projectile.radius > canvas.width ||
                projectile.y - projectile.radius > canvas.height ||
                projectile.y + projectile.radius < 0  ){
                setTimeout(() => {
                    projectiles.splice(index_projectile, 1) //remove projectile
                }, 0)
            }
        })

    } catch (err) {
        console.log(err)
    }
}

function animateParticles () {
    try {  
        particles.forEach((particle, particle_index) => {
            if (particle.alpha <= 0){
                particles.splice(particle_index, 1) //remove particle
            } else (
                particle.update()
            )
        })
        
    } catch (err) {
        console.log(err)
    }
}

function createParticles(projectile, enemy) {
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

//to shrink or remove hit enemy and increase score
function shrinkOrRemoveEnemy(enemy, index_enemy, index_projectile) {
    try {  
        if (enemy.radius - 10 > 8) { //to shrink bigger enemy

            score += HIT_ENEMY
            scoreEl.innerHTML = score

            //gsap library to shrink enemy smoothly
            gsap.to(enemy, { radius: enemy.radius - 10 })
            
            setTimeout(() => {//to remove projectile smoothly without blinking
                projectiles.splice(index_projectile, 1) 
            }, 0)
        
        } else { //to remove smaller enemy

            score += KILL_ENEMY
            scoreEl.innerHTML = score

            setTimeout(() => {
                enemies.splice(index_enemy, 1) //to remove hit enemy
                projectiles.splice(index_projectile, 1) //to remove projectile
            }, 0)
        }

    } catch (err) {
        console.log(err)
    }
}

function animateProjectileInteractions (projectile, index_projectile, enemy, index_enemy) {
    try {
        //to check wheather projectile hits the enemy
        const dist = Math.hypot( projectile.x - enemy.x, projectile.y - enemy.y)
        
        //if projectile touch enemy -> shrink or remove enemy, get points
        if (dist - enemy.radius - projectile.radius < 1 ) {
            createParticles(projectile, enemy)
            shrinkOrRemoveEnemy(enemy, index_enemy, index_projectile)
        }

    } catch (err) {
        console.log(err)

    }
}

function endGameEffect() {
    try {  
        player.remove()
        let color_array = ["white", "orange", "orange", "yellow", "orange", "white", "orange", "yellow"]

        color_array.forEach((color) => {
            particles.push(
                new Particle(canvas.width / 2 + player.radius, canvas.height / 2 + player.radius, 
                    Math.random() * 2, 
                    color, 
                    { 
                        x: (Math.random() - 0.5) * Math.random() * 10, 
                        y: (Math.random() - 0.5) * Math.random() * 10
                    }
                )
            )
        })

    } catch (err) {
        console.log(err)
    }
}

function animateEnemyInteractions (enemy, index_enemy) {
    try {  
        enemy.update() //to draw enemy

        //to check wheather enemy hits the plaeyr
        const dist_from_player = Math.hypot( player.x - enemy.x, player.y - enemy.y,)

        //end of game
        if (dist_from_player - player.radius < 1 ) {
                endGameEffect()
                setTimeout(() => {
                    cancelAnimationFrame(animation_id) 
                    modelEl.hidden = false
                    scoreTotalEl.innerHTML = score
                    gdxDevice.close()
                    clearInterval(spawn_enemy_interval)
                }, 2000)

                return false
        }

        //to check wheather projectil hits the enemy
        projectiles.forEach((projectile, index_projectile) => {
            animateProjectileInteractions(projectile, index_projectile, enemy, index_enemy)
        })
        
    } catch (err) {
        console.log(err)
    }
}

function animate () {
    try {
        animation_id = requestAnimationFrame(animate)
        c.fillStyle = 'rgba(0, 0, 0, 0.1)' //to se a shadow behind moving objects
        c.fillRect(0 , 0, canvas.width, canvas.height) //to clean canvas and delete old projectile
        player.draw() //to draw player

        animateProjectils()
        animateParticles () //efect after projectile hit the enemy

        enemies.forEach((enemy, index_enemy) => {
            animateEnemyInteractions(enemy, index_enemy)
        })
        
    } catch (err) {
        console.log(err)
        output.textContent += (err.toString())
        output.textContent += ('Try to reload page and/or switch off / switch on device.')
    }
}

function spawnEnemySpeeder (){
    try {
        ENEMY_SPAWN_SPEED -=1
        clearInterval(spawn_enemy_interval)
        setEnemySpawner()
        score_checker = score    
    } catch (err) {
        console.log(err)
    }
}

function setEnemySpawner () {
    try {

        spawn_enemy_interval = setInterval(() => {
            if ( score > 1000 + score_checker && ENEMY_SPAWN_SPEED > 1) {
                spawnEnemySpeeder() 
            }
            const radius = Math.random() * (30 - 4) + 4
            let x, y

            //spawn randomly from all directions
            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
                y = Math.random() * canvas.height 
            } else {
                x = Math.random() * canvas.width
                y =  Math.random() < 0.5 ? 0 - radius : canvas.height + radius
            }

            //spawn just from upper half for one axe sensor
            // x = Math.random() * canvas.width
            // y =  0 - radius

            const color = `hsl(${Math.random() * 360}, 50%, 50%)`
            const angle = Math.atan2(
                canvas.height / 2 - y,
                canvas.width / 2 - x
            )
            const velocity = {
                x: Math.cos(angle),
                y: Math.sin(angle)
            }

            enemies.push(new Enemy(x, y, radius, color, velocity))

        }, ENEMY_SPAWN_SPEED * 1000 )
        
    } catch (err) {
        console.log(err)
    }
}

function spawnEnemies () {
    try {

        ENEMY_SPAWN_SPEED = document.getElementById("enemy_spawn_speed").value
        if (ENEMY_SPAWN_SPEED < 0 )
            ENEMY_SPAWN_SPEED = 1
        if (ENEMY_SPAWN_SPEED > 10 )
            ENEMY_SPAWN_SPEED = 10

        setEnemySpawner()

    } catch (err) {
        console.log(err)
    }
}

//For other sensor than "Angle" measurement sensor needs to be redone
async function createProjectile (sensor_values) {  			
    try {
        //to convert degrees to radians 
        let angle = false
        
        if (sensor_values.x >= 9.8)
            angle = 0
        if (sensor_values.x <= - 9.8)
            angle = Math.PI
        if (sensor_values.y >= 9.8)
            angle = Math.PI/2
        if (sensor_values.y <= - 9.8)
            angle = - Math.PI/2

        if (!angle){

            if (Math.asin(sensor_values.y/9.8) > 0)
                angle = Math.acos(sensor_values.x/9.8)
    
            if (Math.asin(sensor_values.y/9.8) < 0)
                angle = Math.PI*2 - Math.acos(sensor_values.x/9.8)

        }

        angle = angle - Math.PI/2

        const velocity = {
            x: Math.cos(angle)* PROJECTILE_SPEED, 
            y: Math.sin(angle)* PROJECTILE_SPEED
        }

        projectiles.push(new Projectile(
            canvas.width / 2,
            canvas.height / 2,
            5, 
            'white', 
            velocity 
        ))
     
    } catch (err) {
        console.error(err);
    }
}

//to choose device sensor to control the game
function chooseControlSensors (device) {
    try {
        //to show all sensors     
        device.sensors.forEach(sensor => {

            if (sensor.name == 'X-axis acceleration' || sensor.name == 'Y-axis acceleration'  ||
                sensor.name == 'Z-axis acceleration' ){
                sensor.enabled = true
                output.textContent += sensor.name + ' enabled\n'
                sensor.emit('state-changed', sensor)
            }
            if (sensor.name != 'X-axis acceleration' && sensor.name != 'Y-axis acceleration' && 
                sensor.name != 'Z-axis acceleration' ){
                sensor.enabled = false
                sensor.emit('state-changed', sensor)
            }
        }) 

        return device

    } catch (err) {
        console.log(err)
    }
}

//to create button to select a device
function createSelectButton () {
    try {
        if (navigator.bluetooth) {
            bleLabel.innerHTML = `Bluetooth`
        } else {
            if (navigator.hid) usbBtn.checked = true
            bleLabel.innerHTML = `Bluetooth <span style="color:red">Not Supported</span> <a href="https://webbluetoothcg.github.io/web-bluetooth/">More information</a>`
            bleBtn.disabled = true
        }
        
        if (navigator.hid) {
            usbLabel.innerHTML = `USB`
        } else {
            if (navigator.bluetooth) bleBtn.checked = true
            usbLabel.innerHTML = `USB <span style="color:red">Not Supported</span> <a href="https://wicg.github.io/webhid/">More information</a>`
            usbBtn.disabled = true
        }
        
        if (!navigator.bluetooth && !navigator.hid) {
            selectDeviceBtn.style.visibility='hidden'
        } 

    } catch (err) {
        console.log(err)
        output.textContent += (err.toString())
        output.textContent += ('Try to reload page and/or switch off / switch on device.')
    }
}