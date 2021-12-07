//CANVAS
const CANVAS_WIDTH = 640 //640 px
const CANVAS_HEIGHT = 480 //480 px

//DOCK x, y coordinates on canvas
const DOCK_X = CANVAS_WIDTH - 150 //CANVAS_WIDTH - 150
const DOCK_Y = CANVAS_HEIGHT - 350 //CANVAS_HEIGHT - 350

//SHIP
//thrusters sensitivity for device Y,Z axis inclinations
const THRUSTER_LIMIT_1 = 3.5 //3.5
const THRUSTER_LIMIT_2 = 6.5 //6.5
const THRUSTER_LIMIT_3 = 8.5 //8.5

const DEVICE_COLLECTING_PERIOD = 20 //time between samples
const SHIP_MASS = 200 //200 for smaller mass ship move quicker
const SHIP_MAX_FUEL = 5000 //5000

//SOUNDS
const WALL_HIT_SOUND_1 = "../sounds/touch.mp3"
const SHIP_CRASH_SOUND = "../sounds/ship_asteroid_crash.mp3"
const SHIP_WIN_SOUND = "../sounds/ship_win.mp3"
const SHIP_OUT_OF_FUEL = "../sounds/out_of_fuel.mp3"


//DEVELOPMENT TOOLS
//to set to true click also can just click on canvas during game, and press 'g' key
const GUIDE_LINES = false //to be set to 'true' to see help lines for development and testing

//ASTEROIDS IN GENERAL

//The number of spawned asteroids, to be config from browser before click to the start button 
//Just for development nad testing purposes
let ASTEROIDS_TOTAL = 3 //3 

//value "200" creates asteroids with randoml size from 200 to 1200
const ASTEROIDS_SIZE = 200 //200

//the bigger asteroids with the same initial push force will move more slowly
const PUSH_ASTEROID_FORCE = 200 //200

/*
    To configure your own asteroids, set CONFIG_OWN_ASTEROID to true and adjust asteriod array.
    If CONFIG_OWN_ASTEROID is set to true, number of asteriods is defined 
    by number of object in below ASTEROIDS_ARRAY. One object i the array defines one astreiod.
    If CONFIG_OWN_ASTEROID is set to false, asteriod will
*/
const CONFIG_OWN_ASTEROID = false //true or false
const ASTEROIDS_ARRAY = [
    { size: 2000, force: 2000},
    { size: 20, force: 20},
    { size: 200, force: 500},
    { size: 2000, force: 2000},
]