//to start game there is needed to select control device
createSelectButton()

const playGameWithDevice = async () => { 
    const bluetooth = document.querySelector('input[name="type"]:checked').value === "1"
      try {

        //to set control sensor from device
        modelEl.hidden = true
        gdxDevice = await godirect.selectDevice(bluetooth)
        output.textContent += `\nConnected to `+ gdxDevice.name + `\n`
        

        gdxDevice.on('device-closed', () => {
            output.textContent += `\n\nDevice disconnected. GAME OVER.\n`
            setTimeout(() => { 
                modelEl.hidden = false
            }, 2000)
        })

        chooseControlSensors(gdxDevice) 

        //to start and animate game
        init() 
        animate() 
        spawnEnemies()
        let sensor_values = {x: false, y: false, z: false, angle: false}

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
                        createProjectile(sensor_values)
                        sensor_values.x = false
                    }
                }		
            })
        })
    
    } catch (err) {
        console.error(err)
    }
}

startGameBtn.addEventListener('click', playGameWithDevice )
