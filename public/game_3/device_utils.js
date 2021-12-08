const usbBtn = document.querySelector('#usb')
const usbLabel = document.querySelector('#usb_label')
const bleBtn = document.querySelector('#ble')
const bleLabel = document.querySelector('#ble_label')
const startGameBtnDevice = document.querySelector('#startGameBtnDevice')
const startGameBtnKeyboard = document.querySelector('#startGameBtnKeyboard')
const startGameBox = document.querySelector('#startGameBox')
const connectDeviceBtn = document.querySelector('#connectDeviceBtn')
const config_game = document.querySelector('#config_game')
const connection_type = document.querySelector('#connection_type')
const output = document.querySelector('#output')

// to play game without Vernier device, just with keyboard arrows 
let WITH_KEYBOARD = false
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
        return false
    }
}

//to select a device
async function connectDevice () {
     try {
        if (gdxDevice){
            gdxDevice.close()

        } else {
            //gdxDevice = await godirect.selectDevice(bluetooth)
            const bleDevice = await navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: 'GDX' }],
                optionalServices: ['d91714ef-28b9-4f91-ba16-f0d9a604f112']
            })

            gdxDevice = await godirect.createDevice(bleDevice, {open: false, startMeasurements: false})

            gdxDevice.on('device-closed', () => {
                output.textContent += `Device disconnected.\n`
                gdxDevice = undefined
            })

            gdxDevice.on('device-opened', () => {
                output.textContent += `Device ` + gdxDevice.name + ` opened.\n`
                if (chooseControlSensors(gdxDevice))//to choose X,Y,Z-axis acceleration
                    setStartBox() //to show start game buttons
            })
            gdxDevice.open(false)
 
        }

    } catch (err) {
        console.log(err)
        output.textContent += ('\nReload page and/or reconnect the device.\n')
    }
}

async function setStartBox () { 
    try {

    connection_type.hidden = true
    startGameBox.hidden = false
    startGameBtnKeyboard.hidden = false
    startGameBtnDevice.hidden = false
    config_game.hidden = false

  } catch (err) {
    console.log(err)
  }
}