 // chart.js line colors 
 window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    green: 'rgb(128, 255, 0)',
    blue: 'rgb(0, 128, 255)',
    maron: 'rgb(102, 51, 0)',
    ping: 'rgb(255, 153, 204)',
};

const usbBtn = document.querySelector('#usb')
const usbLabel = document.querySelector('#usb_label')
const bleBtn = document.querySelector('#ble')
const bleLabel = document.querySelector('#ble_label').id
const selectDeviceBtn = document.querySelector('#select_device')
const output = document.querySelector('#output')


// create global array for sensor readings to be stored
  
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

let sensor_map = new Map
let allSensors = []

// select device function, awaits connection to the device 
const selectDevice = async () => {  			
    const bluetooth = document.querySelector('input[name="type"]:checked').value === "1"
      try {
        const gdxDevice = await godirect.selectDevice(bluetooth)
        output.textContent += `\n Connected to `+gdxDevice.name
        output.textContent += `\n Reading 10 measurements \n`
    
        gdxDevice.on('device-closed', () => {
        output.textContent += `\n\n Disconnected from `+gdxDevice.name+`\n`
        })
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
                console.log(`Sensor: ${sensor.name} value: ${sensor.value} units: ${sensor.unit}`);
                // add data from sensor to line 
                line.data.push(sensor.value);
                //update line on chart with newest sensor value
                window.myLine.update();
                output.textContent += `\n Sensor: ${sensor.name} value: ${sensor.value} units: ${sensor.unit}`;

                // Only collect 10 samples and disconnect
                if (sensor.values.length >= 10){
                    gdxDevice.close();
                }
            })
            i += 1
        })
    
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
};	

window.onload = function() {
    const ctx = document.getElementById('canvas').getContext('2d');
    window.myLine = new Chart(ctx, config);
}; 
  
const colorNames = Object.keys(window.chartColors);

selectDeviceBtn.addEventListener('click', selectDevice);
  
// add line function to add new dataset for each device connected
function addLine(device_name, sensor_name){
    
    const colorName = colorNames[config.data.datasets.length % colorNames.length];
    const newColor = window.chartColors[colorName];
    console.log(newColor)
    console.log(`${device_name}:${sensor_name}`)
      
    // config of the new dataset
    const newDataset = {
        label: `${device_name}:${sensor_name}`,
        backgroundColor: newColor,
        borderColor: newColor,
        data: [],
        fill: false
      };
      config.data.datasets.push(newDataset);
      window.myLine.update();
      // return the dataset to be used later
      return newDataset;
}



