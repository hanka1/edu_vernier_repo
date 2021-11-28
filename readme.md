 - [Edufor examples how to use Vernier sensors](#edufor-examples-how-to-use-vernier-sensors)
  - [How to start with examples:](#how-to-start-with-examples)
  - [Examples](#examples)
    - [Edufor® demo charts](#edufor-demo-charts)
    - [Edufor® demo game - *Game 2*](#edufor-demo-game---game-2)
    - [How to play *Game 2* with Vernier device, i.e. accelerator](#how-to-play-game-2-with-vernier-device-ie-accelerator)
    - [Vernier® original examples](#vernier-original-examples)
- [Edufor's examples how to use Vernier sensors](#edufors-examples-how-to-use-vernier-sensors)
  - [How to start with examples:](#how-to-start-with-examples)
  - [Examples](#examples)
    - [Edufor® demo charts](#edufor-demo-charts)
    - [Edufor® demo game - *Game 2*](#edufor-demo-game---game-2)
    - [How to play *Game 2* with Vernier device, i.e. accelerator](#how-to-play-game-2-with-vernier-device-ie-accelerator)
    - [Vernier® original examples](#vernier-original-examples)
- [Javascript examples for your own application](#javascript-examples-for-your-own-application)
  - [Load Vernier Go Direct device](#load-vernier-go-direct-device)
  - [Choose Vernier Go Direct device sensors](#choose-vernier-go-direct-device-sensors)
    - [Choose all sensors](#choose-all-sensors)
    - [Choose just some sensors](#choose-just-some-sensors)

# Edufor's examples how to use Vernier sensors

## How to start with examples:

For most cases there are two possibilities:

1. Simply open browser and enter the address - the route to "router.html" file, i.e. C:/Vernier/test_vernier_2/public/router.html

2. Run html example pages with *express*
   - app.js runs server framework for Node.js express server 
   - to install all needed packages in terminal run `npm install`  
   - to run express terminal run  `npm start`  
   - open browser at address http://localhost:8000 

- Some exmaples can be run only with express server
- For both cases *Google Chrome browser* have to be used. Vernier devices mostly are not compatible with other browsers.

Start with *router.hmtl* page which refers to other demo pages
![](../public/../test_vernier_2/public/images/docs/router.PNG)

## Examples

### Edufor® demo charts
- There are adjusted chart examples.
- First example shows graph for all sensors of connected Vernier Go Direct device. There will be done 10 measurements of all values.

- Second example allows to choose any sensors of connected Vernier Go Direct device. There is a button to start and/or stop measurements. After 10 measurement you can choose other sensors.

### Edufor® demo game - *Game 2*
- Game 2 can be controlled by GDX-FOR, GDX-ACC, GDX-HD and/or GDX-CART device.
- By the device controller player can shoot to enemies. The goal is to get points by hitting or destroying of enemies.

### How to play *Game 2* with Vernier device, i.e. accelerator

- stick the device with acceleration sensors to a plastic plate with a double stick tape
- switch on the device
- open the page with game (Game 2), for details see above
- click to *Start a new game*
- in a pop up window choose the device in a pop up window and confirm by *Pair*
- play and control the game by plate rotation

![](../public/../test_vernier_2/public/images/docs/sensor.png)
  
### Vernier® original examples
- There are included originals examples from Vernier. For more examples see https://github.com/VernierST/godirect-examples



# Javascript examples for your own application

## Load Vernier Go Direct device
.html file
``` html
    <script src="https://unpkg.com/@vernier/godirect/dist/godirect.min.umd.js"></script>

    <p id="connection_type">
        <input type="radio" id="ble" name="type" value="1" checked>
        <label id="ble_label" for="ble">Bluetooth</label>
        <input type="radio" id="usb" name="type" value="0">
        <label id="usb_label" for="usb">USB</label><br>
    </p>
    <button id="select_device">Select Go Direct Device</button>

    <script src= "example.js"></script>
```
example.js file

``` javascript
const usbBtn = document.querySelector('#usb')
const usbLabel = document.querySelector('#usb_label')
const bleBtn = document.querySelector('#ble')
const bleLabel = document.querySelector('#ble_label').id
const selectDeviceBtn = document.querySelector('#select_device')
let gdxDevice

//to create a button to select connected device
createSelectButton()

//to answer the device selection
selectDeviceBtn.addEventListener('click', selectDevice)

//to create button to select a device
function createSelectButton () {
    try {
        if (navigator.bluetooth) {
            bleLabel.innerHTML = `Bluetooth`
        } else {
            if (navigator.hid) usbBtn.checked = true
            bleLabel.innerHTML = `Bluetooth <span style="color:red">Not Supported</span> <a href="https://webbluetoothcg.github.io/web-bluetooth/">More information</a>`
            bleBtn.disabled = true
        }
        
        if (navigator.hid) {
            usbLabel.innerHTML = `USB`
        } else {
            if (navigator.bluetooth) bleBtn.checked = true
            usbLabel.innerHTML = `USB <span style="color:red">Not Supported</span> <a href="https://wicg.github.io/webhid/">More information</a>`
            usbBtn.disabled = true
        }
        
        if (!navigator.bluetooth && !navigator.hid) {
            selectDeviceBtn.style.visibility='hidden'
        } 

    } catch (err) {
        console.log(err)
        output.textContent += (err.toString())
        output.textContent += ('Try to reload page and/or switch off / switch on device.')
    }
}

//to proceed after a device is chosen
const selectDevice = async () => {
    const bluetooth = document.querySelector('input[name="type"]:checked').value === "1"
    try {

        gdxDevice.on('device-opened', () => {
            //your code after device is chosen and connected
        }

        gdxDevice.on('device-closed', () => {
            //your code after device is closed
        })

        gdxDevice.sensors.forEach( sensor => {
            sensor.on('value-changed', (sensor) => {
               // your functions for sensors values
            })
        })       

    } catch (err) {
        console.error(err)

    }
}

```

## Choose Vernier Go Direct device sensors
By default usualy only a first device sensor is enabled.

### Choose all sensors
example.js file
``` javascript
//to enable all sensors - call this function from `selectDevice()`
//enable all device sensors to be used for measurements
function enableAllSensors (device) {
    try {
        device.sensors.forEach(sensor => {
            if (sensor.enabled !== true) {
                sensor.enabled = true
                sensor.emit('state-changed', sensor)
            }
        }) 

    } catch (err) {
        console.log(err)
    }
}


```

### Choose just some sensors
example.js file
``` javascript
//to choose device sensors - call this function from `selectDevice()`
//this example choose X,Y and Z-axis acceleration sensors
function chooseControlSensors (device) {
    try {
        //for all device all sensors     
        device.sensors.forEach(sensor => {

            if (sensor.name == 'X-axis acceleration' || sensor.name == 'Y-axis acceleration'  ||
                sensor.name == 'Z-axis acceleration' ){
                sensor.enabled = true
                output.textContent += sensor.name + ' enabled\n'
                sensor.emit('state-changed', sensor)
                sensor_found = true
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

```