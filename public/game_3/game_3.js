import * as THREE from "https://cdn.skypack.dev/three@0.135.0"
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.135.0/examples/jsm/loaders/GLTFLoader.js"

import * as game_utils from "./game_utils.js"
import * as device_utils from "./device_utils.js"

let gdxDevice

device_utils.createSelectButton()

const playGameWithDevice = async () => { 
    const bluetooth = document.querySelector('input[name="type"]:checked').value === "1"
      try {

        //to set control sensor from device
        modelEl.hidden = true
        gdxDevice = await godirect.selectDevice(bluetooth)
        console.log(`\nConnected to `+ gdxDevice.name + `\n`)
        

        gdxDevice.on('device-closed', () => {
            output.textContent += `\n\nDevice disconnected. GAME OVER.\n`
            setTimeout(() => { 
                modelEl.hidden = false
            }, 2000)
        })

        device_utils.chooseControlSensors(gdxDevice) 

        //to start and animate game
        //init() 
        //animate() 
        //spawnEnemies()

        game_utils.init()
        game_utils.getRocket()

        let sensor_values = {x: false, y: false, z: false, angle: false}

        let i = 0
        gdxDevice.sensors.forEach( sensor => {
            sensor.on('value-changed', (sensor) => {
                //to shoot on each time sensor values changed
                if (sensor.name == 'X-axis acceleration'){
                    sensor_values.x = sensor.value
                }
                if (sensor.name == 'Y-axis acceleration'){
                    sensor_values.y = sensor.value
                }
                if (sensor.name == 'Z-axis acceleration'){
                    sensor_values.z = sensor.value
                    if (sensor_values.x && sensor_values.y && sensor_values.z){
                        //createProjectile(sensor_values)
                        console.log(sensor_values)
                        sensor_values.x = false
                    }
                    i++
                }	
                if (i = 4)
                gdxDevice.close()

            })
        })
    
    } catch (err) {
        console.error(err)
    }
}

startGameBtn.addEventListener('click', playGameWithDevice )



function onWindowResize() {
    game_utils.camera.aspect = game_utils.container.clientWidth / game_utils.container.clientHeight
    game_utils.camera.updateProjectionMatrix()

    renderer.setSize(game_utils.container.clientWidth, game_utils.container.clientHeight)

}

window.addEventListener("resize", onWindowResize)