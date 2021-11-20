// chart.js line colors 
window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    green: 'rgb(128, 255, 0)',
    blue: 'rgb(0, 128, 255)',
    maron: 'rgb(102, 51, 0)',
    ping: 'rgb(255, 153, 204)',
}

const usbBtn = document.querySelector('#usb')
const usbLabel = document.querySelector('#usb_label')
const bleBtn = document.querySelector('#ble')
const bleLabel = document.querySelector('#ble_label').id
const selectDeviceBtn = document.querySelector('#select_device')
const output = document.querySelector('#output')
const colorNames = Object.keys(window.chartColors)
const sensorArray = document.querySelector('#sensor_array')
const collectBtn = document.querySelector('#start_stop_collection')

// configuration for the chart, change all initial chart settings here
const config = {
    type: 'line',
			data: {
				labels: [0,1,2,3,4,5,6,7,8,9,10],
				datasets: [],
    },
    
    options: {
				responsive: true,
				title: {
					display: true,
					text: 'Chart.js Line Chart'
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Time'
						}
					}],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Value'
          }
        }]
      }
    } 
}

//to create button to select a device
function createSelectButton_1 () {
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

//choose device sensors to be used for measurements
function chooseSensors (device) {
    try {
        //to show all sensors
        let i = 0
        device.sensors.forEach(sensor => {
            sensor.i = i
            sensorArray.innerHTML += `<input type="checkbox" id="${sensor.name}" value="${sensor.i}">`
            sensorArray.innerHTML += `<label for="${sensor.name}"> ${sensor.name}</label><br>`
            i++
        })

        document.getElementById("choose-sensors").hidden = false

    } catch (err) {
        console.log(err)
    }
}

//choose device sensors to be used for measurements
function choosenSensors() {
    try {
        
        gdxDevice.sensors.forEach(sensor => {
            if (document.getElementById(sensor.name).checked){
                sensor.enabled = true
                sensor.emit('state-changed', sensor)
            } else {
                sensor.enabled = false
                sensor.emit('state-changed', sensor)
            }
        }) 

        document.getElementById("choose-sensors").hidden = true
        collectBtn.style.backgroundColor = '#a2d865'
        collectBtn.textContent = `Start Collection`
        collectBtn.hidden = false

    } catch (err) {
        console.log(err)
    }
}

// add line function to add new dataset for each device connected
function addLine (device_name, sensor_name) {
    try {
        colorName = colorNames[config.data.datasets.length % colorNames.length]
        newColor = window.chartColors[colorName]
        
        // config of the new dataset
        const newDataset = {
            label: `${sensor_name}`,
            backgroundColor: newColor,
            borderColor: newColor,
            data: [],
            fill: false,
            options: { title: { text: 'Chart.js Line Chart' + device_name }}
        }
        config.data.datasets.push(newDataset)
        window.myLine.update()
        // return the dataset to be used later
        return newDataset
    } catch (err) {
        console.log(err)
        return {}
    }
}

// add line function to add new dataset for each device connected
async function createStartStopDevice(){
    try {
        // connect to the gdx device  
        const bleDevice = await navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: 'GDX' }],
            optionalServices: ['d91714ef-28b9-4f91-ba16-f0d9a604f112']
        })

        let device = await godirect.createDevice(bleDevice,  {open: false, startMeasurements: false})

        return device

    } catch (err) {
        console.log(err)
        return undefined
    }
}

// start collection function 
const startStopCollection = async () => {  
    if (!collecting) {
        collecting = true
        collectBtn.style.backgroundColor = '#d86965'
        collectBtn.textContent = `Stop Collection`
        gdxDevice.start(delta*1000)
        count = 0.0
        // update the table with the new sensor values
        window.myLine.update()                  
    } else {
        collecting = false
        collectBtn.style.backgroundColor = '#a2d865'
        collectBtn.textContent = `Start Collection`
        gdxDevice.stop()
     }        
}


