const usbBtn = document.querySelector('#usb')
const usbLabel = document.querySelector('#usb_label')
const bleBtn = document.querySelector('#ble')
const bleLabel = document.querySelector('#ble_label')
const startGameBtn = document.querySelector('#startGameBtn')
const startGameBox = document.querySelector('#startGameBox')
const connectDeviceBtn = document.querySelector('#connectDeviceBtn')
const connectDeviceBtn2 = document.querySelector('#connectDeviceBtn2')
const withoutDeviceBtn = document.querySelector('#withoutDeviceBtn')
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
        disconnectDevice()
        //to set control sensor from device
        startGameBox.hidden = true
        connectDeviceBox.hidden = true
        withoutDeviceBtn.hidden = false
        WITHOUT_VERNIER = false
        gdxDevice = await godirect.selectDevice(bluetooth)
        

        output.textContent += `Connected to `+ gdxDevice.name + `\n`
        
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
        output.textContent += ('\nReload page and/or reconnect the device.\n')
    }
}

async function disconnectDevice () {
      try {

        if (!gdxDevice || !gdxDevice.opened){
            output.textContent += `No device connected.\n`
            startGameBox.hidden = true
            connectDeviceBtn.hidden = false
            connectDeviceBox.hidden = false

        } else {
            gdxDevice.close()
            startGameBox.hidden = true
            connectDeviceBox.hidden = false
            connectDeviceBtn.hidden = false
        }

    } catch (err) {
        console.log(err)
    }
}

// to play game without Vernier device, just with key arrows 
let WITHOUT_VERNIER = false
const playGameWithKeys = async () => { 
    try {
        disconnectDevice()
        WITHOUT_VERNIER = true
        connectDeviceBox.hidden = true
        disconnectDeviceBtn.hidden = true
        startGameBox.hidden = false
        connectDeviceBtn2.hidden = false
  
  } catch (err) {
      console.error(err)
  }
}