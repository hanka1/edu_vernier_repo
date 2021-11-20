const usbBtn = document.querySelector('#usb')
const usbLabel = document.querySelector('#usb_label')
const bleBtn = document.querySelector('#ble')
const bleLabel = document.querySelector('#ble_label').id
const selectDeviceBtn = document.querySelector('#select_device')
const output = document.querySelector('#output')
const sensorArray = document.querySelector('#sensor_array')
const collectBtn = document.querySelector('#start_stop_collection')

const canvas = document.querySelector('canvas')
const scoreEl = document.querySelector('#scoreEl')
const startGameBtn = document.querySelector('#startGameBtn')
const modelEl = document.querySelector('#modelEl')
const scoreTotalEl = document.querySelector('#scoreTotalEl')
const divCanvasGame = document.querySelector('#div_canvas_game')

divCanvasGame.style.maxWidth = CANVAS_WIDTH + 'px'
divCanvasGame.style.backgroundColor = "black"

canvas.height = CANVAS_HEIGHT
canvas.width= CANVAS_WIDTH

const c = canvas.getContext('2d')

let gdxDevice
let animation_id
let score = 0

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

function spawnEnemies () {
    try {
        setInterval(() => {
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

//For other sensor than "Angle" measurement sensor needs to be redone
async function createProjectile (sensor) {  			
    try {

        //to convert degrees to radians 
        const angle = - sensor.value * Math.PI / 180 

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

        // print the sensor name, value and units
        output.textContent += `\n Sensor: ${sensor.name} value: ${sensor.value} units: ${sensor.unit}`;	
     
    } catch (err) {
        console.error(err);
    }
}

//to choose device sensor to control the game
//if not found, default device sensor will be used
//this game stage is set only for Angle
function chooseControlSensors (device, sensor_name) {
    try {
        let enabled_sensor = false
        //to show all sensors     
        device.sensors.forEach(sensor => {
            if (sensor.name == sensor_name){
                sensor.enabled = true
                sensor.emit('state-changed', sensor)
                sensor_found = true
                enabled_sensor = sensor
            } else {
                sensor.enabled = false
                sensor.emit('state-changed', sensor)
            }
        }) 

        if (!enabled_sensor){
            device.sensors[0].enabled = true
            device.sensors[0].emit('state-changed', device.sensors[0])
            sensor_name = device.sensors[0].name
            enabled_sensor = device.sensors[0]
        }

        output.textContent += `\n Game will be controled by `+ sensor_name + `\n`
        return [enabled_sensor]

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