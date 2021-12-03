//startNewGame()
//connectDeviceBox.hidden = true
//startGameBox.hidden = true

const playGameWithDevice = async () => { 
      try {
        startNewGame()

        let sensor_values = {x: false, y: false, z: false}
        gdxDevice.sensors.forEach( sensor => {
            sensor.on('value-changed', (sensor) => {
                //to shoot on each time sensor values changed
                if (sensor.name == 'X-axis acceleration'){
                    sensor_values.x = sensor.value
                }
                if (sensor.name == 'Y-axis acceleration'){
                    sensor_values.y = sensor.value
                }
                if (sensor.name == 'Z-axis acceleration'){
                    sensor_values.z = sensor.value
                    if (sensor_values.x && sensor_values.y && sensor_values.z){
                        updateShipThrusters(sensor_values)
                        sensor_values.x = false  
                    }
                }     
            })
        })
    
    } catch (err) {
        console.error(err)
    }
}

connectDeviceBtn.addEventListener('click', connectDevice )
startGameBtn.addEventListener('click', playGameWithDevice )
disconnectDeviceBtn.addEventListener('click', disconnectDevice )

function startNewGame () {
    try{
        startGameBox.hidden = true 
        particles = []
        asteroids = []
        init() 
        animate()
        gdxDevice.start()
        console.log ("GAME STARTED \n")

    } catch (err) {
        console.log(err)
    }
}

//to restart game properties
function init () {
    try{
        c.fillStyle = "black"
        c.fillRect(0 , 0, canvas.width, canvas.height)

        dock = new Dock (DOCK_X , DOCK_Y, 100, 70, 'rgb(200, 231, 240)' )
        ship = new Ship(canvas.width / 2, canvas.height / 2, SHIP_MASS)

        spawnAsteroids()

        score = 0
        scoreEl.innerHTML = score
        scoreTotalEl.innerHTML = score
        
    } catch (err) {
        console.log(err)
    }
}

function animate() {
    try {
        animation_id = requestAnimationFrame(animate)
        c.clearRect(0, 0, c.canvas.width, c.canvas.height)
        update()
        draw()
        if ( i > 12000 ) {
            //TODO
            gameOver()
        }
 
    } catch (err) {
        console.log(err)
        output.textContent += (err.toString())
        output.textContent += ('Try to reload page and/or switch off / switch on device.')
    }
}

function gameOver() {
    try{
        cancelAnimationFrame(animation_id)
        gdxDevice.stop()
        i = 0
        output.textContent += ("GAME OVER \n")
        setTimeout(() => {
            startGameBox.hidden = false
            scoreTotalEl.innerHTML = score               
        }, 2000)
        

    } catch (err) {
        console.log(err)
    }
}

//for testing and dev only
c.canvas.addEventListener("keydown", (e) => {
    key_handler(e, true)
}, true)
   
c.canvas.addEventListener("keyup", (e) => {
    key_handler(e, false)
}, true)
