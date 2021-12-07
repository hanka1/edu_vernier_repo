const playGame = async () => { 
      try {
        startNewGame()

        if (!WITHOUT_VERNIER){
            //to get and solve sensor values as thrusters are powered on
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
        }

    } catch (err) {
        console.error(err)
    }
}

connectDeviceBtn.addEventListener('click', connectDevice )
connectDeviceBtn2.addEventListener('click', connectDevice )
withoutDeviceBtn.addEventListener('click', playGameWithKeys )
startGameBtn.addEventListener('click', playGame )
disconnectDeviceBtn.addEventListener('click', disconnectDevice )

//to reset initial variables
function startNewGame () {
    try{
        startGameBox.hidden = true 
        particles = []
        asteroids = []
        ship_collision = false
        init() 
        animate()
        if (!WITHOUT_VERNIER)
            gdxDevice.start(DEVICE_COLLECTING_PERIOD) //to start getting sensors values
        console.log("GAME STARTED \n")
        clearInterval(endGameEffectInterval)

    } catch (err) {
        console.log(err)
    }
}

//to restart game properties
function init () {
    try{
        resetStopWatch()
        startStopWatch()

        c.fillStyle = "black"
        c.fillRect(0 , 0, canvas.width, canvas.height)

        dock = new Dock (DOCK_X , DOCK_Y, 100, 70 )
        ship = new Ship(canvas.width / 2, canvas.height / 2, SHIP_MASS)
        //ship = new Ship(-canvas.width - 50, - canvas.height - 50, SHIP_MASS) //ship out of canvas for tests
        //ship = new Ship(dock.x - 10, dock.y + 40, SHIP_MASS) //ship in front of the dock for tests

        ASTEROIDS_TOTAL = document.getElementById("game_config_input").value

        spawnAsteroids()

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

    } catch (err) {
        console.log(err)
        output.textContent += (err.toString()+'\n')
        output.textContent += ('\nTry to reload page and/or switch off / switch on device.\n')
    }
}

function gameOver() {
    try{
        clearInterval(stopWatchInterval) //to stop stopwatch
        cancelAnimationFrame(animation_id)
        if (!WITHOUT_VERNIER)
            gdxDevice.stop() //to stop getting sensors values
        i = 0 //for testing and development only
        output.textContent += ("GAME OVER \n")
        setTimeout(() => {
            startGameBox.hidden = false
            startGameBtn.hidden = false
            withoutDeviceBtn.hidden = false
            if (WITHOUT_VERNIER)
                connectDeviceBtn2.hidden = false
            else {
                connectDeviceBtn2.hidden = true
                connectDeviceBtn.hidden = true
                disconnectDeviceBtn.hidden = false
            }

            //scoreTotalEl.innerHTML = score               
        }, 2000)
    
    } catch (err) {
        console.log(err)
    }
}

//for testing and dev only
//if uncommented thruster can be controled also with key arrows
c.canvas.addEventListener("keydown", (e) => {
    keyHandler(e, true)
}, true)
   
c.canvas.addEventListener("keyup", (e) => {
    keyHandler(e, false)
}, true)
