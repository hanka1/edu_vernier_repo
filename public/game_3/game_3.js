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

function startNewGame() {
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
