let count = 0
let gdxDevice
let collecting = false
let delta = 1.0

//to select device function, awaits connection to the device 
const selectDevice = async () => {
    try {
        sensorArray.innerHTML = []

        if (gdxDevice){
            gdxDevice.close()
        } else {
            //to create the device but don't open or start measurements
            gdxDevice = await createStartStopDevice()

            gdxDevice.on('device-closed', () => {
                selectDeviceBtn.textContent = `Select Go Direct Device`
                selectDeviceBtn.hidden = false
                collectBtn.hidden = true
                output.textContent += `\n\n Disconnected from `+ gdxDevice.name +`\n`
                gdxDevice = undefined
            })

            gdxDevice.on('device-opened', () => {
                selectDeviceBtn.hidden = true
                //to enable all sensors for measurements 
                chooseSensors(gdxDevice) 

                gdxDevice.sensors.forEach((enabledSensor) => {
                    //to add line to chart for each sensor
                    let line = addLine(gdxDevice.name, enabledSensor.name)

                    enabledSensor.on('value-changed', (sensor) => {
                        //to add data from sensor to line 
                        line.data.push(sensor.value)

                        output.textContent += `\n Sensor: ${sensor.name} value: ${sensor.value} units: ${sensor.unit}`
                        //to update line on chart with newest sensor value
                        window.myLine.update()
                        count += delta;   

                        //to collect 10 samples and disconnect
                        if (sensor.values.length >= 10) {
                            gdxDevice.close()
                            sensorArray.innerHTML = []
                            collectBtn.hidden = true
                            selectDeviceBtn.hidden = false
                        }
                    })
                })
            })
            gdxDevice.open(false)
        }

    } catch (err) {
        console.error(err)
        output.textContent += (err.toString())
        output.textContent += ('Try to reload page and/or switch off / switch on device.')
    }
}

//to start the selectDevice function when the button is pressed
selectDeviceBtn.addEventListener('click', selectDevice)

window.onload = function() {
    const ctx = document.getElementById('canvas').getContext('2d')
    window.myLine = new Chart(ctx, config)
} 



