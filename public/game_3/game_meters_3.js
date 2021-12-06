class Indicator {
    constructor (x, y, width, height) {
        //this.label = label + ":  "
        this.x = x
        this.y = y
        this.width = width
        this.height = height 
    }
    
    draw (c, max, level) {
        c.save()
        c.strokeStyle = "rgb(145, 226, 215)"
        c.fillStyle = "rgb(145, 226, 215)"
        //c.font = this.height + "pt Calibri"
        //let offset = c.measureText(this.label).width
        //c.fillText(this.label, this.x, this.y + this.height - 1)
        c.beginPath()
        c.rect(this.x, this.y, this.width, this.height)
        c.stroke()
        c.beginPath()
        c.rect(this.x, this.y, this.width * (max / level), this.height)
        c.fill()
        c.restore()
    }
}

//STOPWATCH
let startTime
let elapsedTime = 0
let stopWatchInterval

function startStopWatch() {
    startTime = Date.now() - elapsedTime
    stopWatchInterval = setInterval(() => {

      elapsedTime = Date.now() - startTime
      document.getElementById("timeEl").innerHTML = timeToString(elapsedTime)

    }, 10) //each 1/100 s

}

function resetStopWatch() {
    clearInterval(stopWatchInterval)
    document.getElementById("timeEl").innerHTML = "00:00:00"
    elapsedTime = 0
}

function timeToString(time) {
    let diffInHrs = time / 3600000
    let hh = Math.floor(diffInHrs)
  
    let diffInMin = (diffInHrs - hh) * 60
    let mm = Math.floor(diffInMin)
  
    let diffInSec = (diffInMin - mm) * 60
    let ss = Math.floor(diffInSec);
  
    let diffInMs = (diffInSec - ss) * 100
    let ms = Math.floor(diffInMs)
  
    let formattedMM = mm.toString().padStart(2, "0")
    let formattedSS = ss.toString().padStart(2, "0")
    let formattedMS = ms.toString().padStart(2, "0")
  
    return `${formattedMM}:${formattedSS}:${formattedMS}`
}
//

//to control thrusters by arrow keys for for testing and development
function keyHandler(e, value) {
    var nothing_handled = false
    
    if (value){
        value = 1
        ship.fuel -= 1
    }
        
    switch(e.key || e.keyCode) {
        case "ArrowUp":
        case 38: // up arrow
            ship.up_thruster = value
            break
        case "ArrowLeft":
        case 37: // left arrow
            ship.left_thruster = value
            break
        case "ArrowRight":
        case 39: // right arrow
            ship.right_thruster = value
            break
        case "ArrowDown":
        case 40:
            ship.down_thruster = value
            break
        case " ":
        case 32: //spacebar
            ship.trigger = value
            break
        case "g":
        case 71: //g
            if(value) 
                guide = !guide
        default:
            nothing_handled = true
    }
    if(!nothing_handled) e.preventDefault();
}

//for testing and development
function drawGrid(ctx, minor, major, stroke, fill) {
    minor = minor || 10
    major = major || minor * 5
    stroke = stroke || "#00FF00"
    fill = fill || "#009900"
    ctx.save()
    ctx.strokeStyle = stroke
    ctx.fillStyle = fill
    
    let width = ctx.canvas.width, height = ctx.canvas.height
   
    for(let x = 0; x < width; x += minor) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.lineWidth = (x % major == 0) ? 0.5 : 0.25
        ctx.stroke()
        if(x % major == 0 ) 
            ctx.fillText(x, x, 10)
    }

    for (let y = 0; y < height; y += minor) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.lineWidth = (y % major == 0) ? 0.5 : 0.25
        ctx.stroke()
        if(y % major == 0 )
            ctx.fillText(y, 0, y + 10)
    }
    
    ctx.restore()

    c.save()

    c.strokeStyle = "orange"
    c.lineWidth = 1
    c.beginPath()
    c.moveTo( dock.x -20 , dock.y - 20,)
    c.lineTo( dock.x + dock.width + 20 , dock.y - 20,)
    c.stroke()
    c.closePath()

    c.beginPath()
    c.moveTo( dock.x -20 , dock.y + 10 )
    c.lineTo( dock.x + dock.width + 20 , dock.y + 10 )
    c.stroke()
    c.closePath()

    c.beginPath()
    c.moveTo( dock.x + dock.width + 20 , dock.y - 20)
    c.lineTo( dock.x + dock.width + 20 , dock.y + dock.height + 20)
    c.stroke()
    c.closePath()

    c.beginPath()
    c.moveTo( dock.x + dock.width - 10 , dock.y - 20)
    c.lineTo( dock.x + dock.width -10 , dock.y + dock.height + 20)
    c.stroke()
    c.closePath()


    c.beginPath();
    c.moveTo( dock.x + dock.width + 20  , dock.y + dock.height + 20);
    c.lineTo( dock.x -20 , dock.y + dock.height + 20);
    c.stroke(); 
    c.closePath();


    c.beginPath();
    c.moveTo( dock.x + dock.width + 20  , dock.y + dock.height - 10 ,);
    c.lineTo( dock.x -20 , dock.y + dock.height - 10  );
    c.stroke(); 
    c.closePath();

    c.restore();
}

//for testing and development
function drawLine(ctx, obj1, obj2) {
    ctx.save()
    ctx.strokeStyle = "white"
    ctx.lineWidth = 0.2
    ctx.beginPath()
    ctx.moveTo(obj1.x, obj1.y)
    ctx.lineTo(obj2.x, obj2.y)
    ctx.stroke()
    ctx.restore()
}

//for testing and development
let previous
function consoleLogThurstersPower (up_thruster, down_thruster, left_thruster, right_thruster) {
    try {
        let time_now = Date.now()
        console.log((time_now-previous)/100)
        previous = time_now

        console.log("up_thruster:    " + up_thruster)
        console.log("down_thruster:  " + down_thruster)
        console.log("left_thruster:  " + left_thruster)
        console.log("right_thruster: " + right_thruster)

    } catch (err) {
        console.log(err)
    }
}