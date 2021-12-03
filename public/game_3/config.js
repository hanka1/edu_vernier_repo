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

const SHIP_MASS = 200 //200 for smaller mass ship move quicker
const SHIP_MAX_FUEL = 500 //500

//ASTEROIDS
const ASTEROIDS_TOTAL = 3
const ASTEROIDS_SIZE = 200 //200, partly randomized in given range
//bigger asteroids with the same initial push force will move more slowly
const PUSH_ASTEROID_FORCE = 200 //200
 

//SOUNDS
const CRASH_SOUND_1 = "../sounds/crash.mp3"


//DEVELOPMENT TOOLS
//to set to true click also can just click on canvas during game, and press 'g' key
const GUIDE_LINES = false //to be set to 'true' to see help lines