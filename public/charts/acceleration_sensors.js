//to create button to select a device
createSelectButton_1()

// select device function, awaits connection to the device and make measurements 
const selectDevice = async () => {  			
    const bluetooth = document.querySelector('input[name="type"]:checked').value === "1"
      try {
        const gdxDevice = await godirect.selectDevice(bluetooth)
        output.textContent += `\n Connected to `+ gdxDevice.name + `\n Reading 10 measurements \n`
    
        gdxDevice.on('device-closed', () => {
            output.textContent += `\n\n Disconnected from `+ gdxDevice.name +`\n`
        })

        //enable all device sensors to be used for measurements
        enableAllSensors(gdxDevice)     
    
        //to iterate over all device sensors and make measuring
        gdxDevice.sensors.forEach((device_sensor) => {
            
            //to add line to chart for each sensor
            const line = addLine(gdxDevice.name, device_sensor.name)

            device_sensor.on('value-changed', (sensor) => {
                //to add data from sensor to line 
                line.data.push(sensor.value)
                //to update line on chart with newest sensor value
                window.myLine.update()
                output.textContent += `\n Sensor: ${sensor.name} value: ${sensor.value} units: ${sensor.unit}`

                //to collect 10+1 samples and disconnect
                if (sensor.values.length >= 11){
                    gdxDevice.close() //to close reading values
                }
            })
        })
    
    } catch (err) {
        console.error(err)
    }
}

//to start the selectDevice function when the button is pressed
selectDeviceBtn.addEventListener('click', selectDevice)

//to create a chart
window.onload = function() {
    const ctx = document.getElementById('canvas').getContext('2d')
    window.myLine = new Chart(ctx, config)
}
  
selectDeviceBtn.addEventListener('click', selectDevice)



