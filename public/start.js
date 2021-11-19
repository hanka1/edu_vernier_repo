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
const collectBtn = document.querySelector('#start_stop_collection')
const output = document.querySelector('#output')

let count = 0
// create global object gdxDevice to be used in other 
let gdxDevice
let sensor_map = new Map
let allSensors = []
let collecting = false
let delta = 1.0

// select device function, awaits connection to the device 
const selectDevice = async () => {  			
    //const bluetooth = document.querySelector('input[name="type"]:checked').value === "1"
    try {

        if (gdxDevice){
            gdxDevice.close();
        } else {
            // connect to the gdx device  
            const bleDevice = await navigator.bluetooth.requestDevice({
              filters: [{ namePrefix: 'GDX' }],
              optionalServices: ['d91714ef-28b9-4f91-ba16-f0d9a604f112']
            })

            // Create the device but don't open or start measurements.
            gdxDevice = await godirect.createDevice(bleDevice,  {open: false, startMeasurements: false})

            // print that the device is disconnected
            gdxDevice.on('device-closed', () => {
                output.textContent += `\n\n Disconnected from `+gdxDevice.name+`\n`
                gdxDevice = undefined
                selectDeviceBtn.textContent = `Select Go Direct Device`
            });

            gdxDevice.on('device-opened', () => {
                // enable the default sensor to use for measurements
                gdxDevice.enableDefaultSensors()
                
                gdxDevice.sensors.forEach(sensor => {
                    if (sensor.enabled !== true) {
                        sensor.enabled = true
                        sensor.emit('state-changed', sensor)
                    }
                
                })

                let i = 0
                gdxDevice.sensors.forEach(() => {
                    const enabledSensor = gdxDevice.sensors[i]
                    
                    // add line to chart for each sensor
                    const line = addLine(gdxDevice.name, enabledSensor.name)

                    enabledSensor.on('value-changed', (sensor) => {
                        // log the sensor name, new value and units.
                        console.log(`Sensor: ${sensor.name} value: ${sensor.value} units: ${sensor.unit}`)
                        // add data from sensor to line 
                        line.data.push(sensor.value)
                        //update line on chart with newest sensor value
                        window.myLine.update()
                        output.textContent += `\n Sensor: ${sensor.name} value: ${sensor.value} units: ${sensor.unit}`
                        count += delta;   

                        // Only collect 10 samples and disconnect
                        if (sensor.values.length >= 10){
                            gdxDevice.close()
                        }
                    })
                    i += 1
                })
            })
            gdxDevice.open(false)
        }
    
    } catch (err) {
        console.error(err)
    }
}

// start the selectDevice function when the button is pressed
selectDeviceBtn.addEventListener('click', selectDevice)

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

window.onload = function() {
    const ctx = document.getElementById('canvas').getContext('2d')
    window.myLine = new Chart(ctx, config)
} 
  
const colorNames = Object.keys(window.chartColors)

selectDeviceBtn.addEventListener('click', selectDevice)
  
// add line function to add new dataset for each device connected
function addLine(device_name, sensor_name){
    
    const colorName = colorNames[config.data.datasets.length % colorNames.length]
    const newColor = window.chartColors[colorName]
    console.log(newColor)
    console.log(`${device_name}:${sensor_name}`)
      
    // config of the new dataset
    const newDataset = {
        label: `${device_name}:${sensor_name}`,
        backgroundColor: newColor,
        borderColor: newColor,
        data: [],
        fill: false
      }
      config.data.datasets.push(newDataset)
      window.myLine.update()
      // return the dataset to be used later
      return newDataset
}

// start collection function 
const startStopCollection = async () => {  
    if (!collecting) {
        collecting = true;
        collectBtn.textContent = `Stop Collection`;
        gdxDevice.start(delta*1000);
        count = 0.0
        // update the table with the new sensor values
        window.myLine.update()                  
    } else {
        collecting = false;
        collectBtn.textContent = `Start Collection`;
        gdxDevice.stop();
     }        
};



