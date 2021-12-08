const usbBtn = document.querySelector('#usb')
const usbLabel = document.querySelector('#usb_label')
const bleBtn = document.querySelector('#ble')
const bleLabel = document.querySelector('#ble_label')
const startGameBtn = document.querySelector('#startGameBtn')
const startGameBox = document.querySelector('#startGameBox')
const connectDeviceBtn = document.querySelector('#connectDeviceBtn')
const withKeyBoardBtn = document.querySelector('#withKeyBoardBtn')
const disconnectDeviceBtn = document.querySelector('#disconnectDeviceBtn')
const config_game = document.querySelector('#config_game')
const connection_type = document.querySelector('#connection_type')
const output = document.querySelector('#output')

// to play game without Vernier device, just with keyboard arrows 
let WITHOUT_VERNIER = false
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
            
            setStartBox("start_game_device") //to show start game button

            gdxDevice.on('device-closed', () => {
                output.textContent += `Device disconnected.\n`
                gdxDevice = undefined
            })

            gdxDevice.on('device-opened', () => {
                output.textContent += `Device ` + gdxDevice.name + ` opened.\n`
                chooseControlSensors(gdxDevice) //to choose X,Y,Z-axis acceleration
            })
            gdxDevice.open(false)
        }

    } catch (err) {
        console.log(err)
        output.textContent += ('\nReload page and/or reconnect the device.\n')
    }
}

async function disconnectDevice () {
      try {

        if (!gdxDevice || !gdxDevice.opened)
            output.textContent += `No device connected.\n`
        else
            gdxDevice.close()

        setStartBox('initial')

    } catch (err) {
        console.log(err)
    }
}

async function playGameWithKeys () { 
    try {
        disconnectDevice()
        setStartBox("start_game_keyboard")
       
  } catch (err) {
    console.log(err)
  }
}

async function setStartBox (type) { 
    try {

        if (type == "initial"){
            WITHOUT_VERNIER = false
            startGameBox.hidden = false
            connection_type.hidden = false
            withKeyBoardBtn.hidden = false
            startGameBtn.hidden = true
            disconnectDeviceBtn.hidden = true
            config_game.hidden = true
            scoreTotalEl.innerHTML = "</br>"
        }

        if (type == "start_game_device"){
            WITHOUT_VERNIER = false
            startGameBox.hidden = false
            connection_type.hidden = true
            withKeyBoardBtn.hidden = true
            startGameBtn.hidden = false
            startGameBtn.innerHTML = "Start a new game "
            disconnectDeviceBtn.hidden = false
            config_game.hidden = false
        }

        if (type == "start_game_keyboard"){
            WITHOUT_VERNIER = true
            startGameBox.hidden = false
            connection_type.hidden = false
            withKeyBoardBtn.hidden = true
            startGameBtn.hidden = false
            startGameBtn.innerHTML = "Start a keyboard game "
            disconnectDeviceBtn.hidden = true
            config_game.hidden = false
        }

  } catch (err) {
    console.log(err)
  }
}