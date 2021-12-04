const usbBtn = document.querySelector('#usb')
const usbLabel = document.querySelector('#usb_label')
const bleBtn = document.querySelector('#ble')
const bleLabel = document.querySelector('#ble_label')
const startGameBtn = document.querySelector('#startGameBtn')
const startGameBox = document.querySelector('#startGameBox')
const connectDeviceBtn = document.querySelector('#connectDeviceBtn')
const connectDeviceBox = document.querySelector('#connectDeviceBox')
const disconnectDeviceBtn = document.querySelector('#disconnectDeviceBtn')
const output = document.querySelector('#output')

let gdxDevice

//to choose device sensor to control the game
function chooseControlSensors (device) {
    try {
        //to show all sensors     
        device.sensors.forEach(sensor => {

            if (sensor.name == 'X-axis acceleration' || sensor.name == 'Y-axis acceleration'  ||
                sensor.name == 'Z-axis acceleration' ){
                sensor.enabled = true
                console.log(sensor.name + ' enabled\n')
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

//to select a device
async function connectDevice () {
    const bluetooth = document.querySelector('input[name="type"]:checked').value === "1"
      try {

        //to set control sensor from device
        startGameBox.hidden = true
        connectDeviceBox.hidden = true
        gdxDevice = await godirect.selectDevice(bluetooth)
        

        output.textContent += `\nConnected to `+ gdxDevice.name + `\n`
        
        gdxDevice.on('device-closed', () => {
            output.textContent += `Device disconnected.\n`
            startGameBox.hidden = true
            connectDeviceBox.hidden = false
        })
        chooseControlSensors(gdxDevice) //to choose X,Y,Z-axis acceleration
        gdxDevice.stop()
        startGameBox.hidden = false 

    } catch (err) {
        console.log(err)
        output.textContent += (err.toString())
        output.textContent += ('Try to reload page and/or switch off / switch on device.')
    }
}

async function disconnectDevice () {
      try {

        if(!gdxDevice || !gdxDevice.opened)
            output.textContent += `\nNo device connected.\n`
        else {
            gdxDevice.close()
            startGameBox.hidden = true
            connectDeviceBox.hidden = false
        }

    } catch (err) {
        console.log(err)
    }
}