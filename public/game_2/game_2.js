//to start game there is needed to select control device
createSelectButton ()

const playGameWithDevice = async () => { 
    const bluetooth = document.querySelector('input[name="type"]:checked').value === "1"
      try {
        //to set control sensor from device
        gdxDevice = await godirect.selectDevice(bluetooth)
        output.textContent += `\n Connected to `+ gdxDevice.name + `\n`
        modelEl.hidden = true

        gdxDevice.on('device-closed', () => {
            output.textContent += `\n\n Device disconnected. GAME OVER.\n`
            setTimeout(() => { 
                modelEl.hidden = false
            }, 2000)
        })

        //For other than "Angle" sensor fnc createProjectile(sensor) needs to be redone
        const enabledSensors = chooseControlSensors(gdxDevice, 'Angle') //'Angle' 

        //to start and animate game
        init() 
        animate() 
        spawnEnemies()

        enabledSensors.forEach(sensor => {
            sensor.on('value-changed', (sensor) => {
                //to shoot on each time sensor value changed
                createProjectile(sensor)			
            })
        })
    
    } catch (err) {
        console.error(err)
    }
}

startGameBtn.addEventListener('click', playGameWithDevice )
