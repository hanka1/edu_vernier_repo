window.chartColors = {
    // create colors for chart to use
    green: 'rgb(255, 99, 132)',
}; 

const usbBtn = document.querySelector('#usb');
const usbLabel = document.querySelector('#usb_label');
const bleBtn = document.querySelector('#ble');
const bleLabel = document.querySelector('#ble_label').id;
const selectDeviceBtn = document.querySelector('#select_device');
const output = document.querySelector('#output');


// create global array for sensor readings to be stored
let sensorReadings = [];   
if (navigator.bluetooth) {
    bleLabel.innerHTML = `Bluetooth`;
} else {
    if (navigator.hid) usbBtn.checked = true;
    bleLabel.innerHTML = `Bluetooth <span style="color:red">Not Supported</span> <a href="https://webbluetoothcg.github.io/web-bluetooth/">More information</a>`;
    bleBtn.disabled = true;
}

if (navigator.hid) {
    usbLabel.innerHTML = `USB`;
} else {
    if (navigator.bluetooth) bleBtn.checked = true;
    usbLabel.innerHTML = `USB <span style="color:red">Not Supported</span> <a href="https://wicg.github.io/webhid/">More information</a>`;
    usbBtn.disabled = true;
}

if (!navigator.bluetooth && !navigator.hid) {
    selectDeviceBtn.style.visibility='hidden';
} 

// select device function, awaits connection to the device 
const selectDevice = async () => {  			
    const bluetooth = document.querySelector('input[name="type"]:checked').value === "1";
      try {
        const gdxDevice = await godirect.selectDevice(bluetooth);
        output.textContent += `\n Connected to `+gdxDevice.name;
        output.textContent += `\n Reading 10 measurements \n`;
    
        gdxDevice.on('device-closed', () => {
        output.textContent += `\n\n Disconnected from `+gdxDevice.name+`\n`;
        });
        // enable the default sensor to use for measurements
        gdxDevice.enableDefaultSensors(); 		
        
        const enabledSensors = gdxDevice.sensors.filter(s => s.enabled);

        const allSensors = gdxDevice.sensors;
        console.log(allSensors)
        
        allSensors.forEach(sensor => {
       
                if (sensor.enabled !== true) {
                    sensor.enabled = true;
                    sensor.emit('state-changed', sensor);
                }
        

            sensor.on('value-changed', (sensor) => {

                // log the sensor name, new value, and units.
                //console.log(`Sensor: ${sensor.name} value: ${sensor.value} units: ${sensor.unit}`);
                output.textContent += `\n Sensor: ${sensor.name} value: ${sensor.value} units: ${sensor.unit}`
            });
        });

        enabledSensors.forEach(sensor => {
            sensor.on('value-changed', (sensor) => {
                // Only collect 10 samples and disconnect.
                if (sensor.values.length > 10){
                gdxDevice.close();
                }
                // log the sensor name, new value and units.
                console.log(`Sensor: ${sensor.name} value: ${sensor.value} units: ${sensor.unit}`);
                // output the change to the pre tag
            
                // add the sensor value to the sensorReading array  
                sensorReadings.push(sensor.value);
                let unit = sensor.unit; 
                
                // use the addData function to add the sensor data to the chart
                addData(config, sensor.unit);
                // print the sensor name, value and units
                output.textContent += `\n Sensor: ${sensor.name} value: ${sensor.value} units: ${sensor.unit}`;					
            });
        });
    
    } catch (err) {
        console.error(err);
    }
};

// chart setup
let config = {
  // type of chart, could be 'line' or 'bar' 			
    type: 'line', 		
    data: {
        // x axis labels
        labels: [1,2,3,4,5,6,7,8,9,10],   
        datasets: [{
            label: '',
            backgroundColor: window.chartColors.green,
            borderColor: window.chartColors.green,
            // initial data, sensor data to be added with addData function
            data: [], 				
            fill: false,
        }]
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
    let ctx = document.getElementById('canvas').getContext('2d');
    window.myLine = new Chart(ctx, config);
}; 

let colorNames = Object.keys(window.chartColors);

    
config.data.datasets.forEach(function(dataset) {
    // send the data to the dataset to be added to the line
    dataset.data.pop();   
});

// start the selectDevice function when the button is pressed
selectDeviceBtn.addEventListener('click', selectDevice); 		

// addData function to add data to the chart
function addData(chart, unit) { 
    // label the chart with the units from the sensor
    chart.data.label = unit; 			
    // for each data point in the data set, add the sensorReading value
    chart.data.datasets.forEach((dataset) => { 		
        dataset.data.push(sensorReadings.pop());
    });
    
    // update the chart line
    window.myLine.update(); 		
}
