

class Dock {
    constructor (x, y, width, height, color) {
        this.x = x
        this.y = y 
        this.width = width 
        this.height = height 
        this.color = color
    }
    draw (c) {
        c.save()
        c.beginPath()
        c.rect(this.x, this.y, this.width, this.height)
        //c.rect(this.x, this.y, this.width, this.height)
        c.fillStyle = this.color
        c.fill()

        c.lineWidth = 6
        c.strokeStyle =  "rgb(14, 61, 88)"
        c.stroke()
        c.restore()
    }
}

class Dock_door {
    constructor (x, y, height, color) {
        this.x = x
        this.y = y 
        this.height = height 
        this.color = color
    }
    draw (c) {
        c.save()
        c.beginPath()
        c.rect(this.x - 5, this.y - 5, 15, this.height + 10)
        c.fillStyle = this.color 
        c.fill()
        c.restore()
    }
}

let dock = new Dock (canvas.width - 150, canvas.height - 350, 100, 70, 'rgb(200, 231, 240)' )
let dock_doors = new Dock_door (canvas.width - 150, canvas.height - 350, 70, 'black' )

class Mass {
    constructor (x, y, mass, radius, angle, x_speed, y_speed, rotation_speed) {
        this.x = x
        this.y = y
        this.mass = mass || 1
        this.radius = radius || 50
        this.angle = angle || 0
        this.x_speed = x_speed || 0
        this.y_speed = y_speed || 0
        this.rotation_speed = rotation_speed || 0
        //todo force calculation
        this.force = this.mass * Math.sqrt(this.x_speed * this.x_speed + this.y_speed + this.y_speed)
        this.in_dock = false
    }

    update (ctx) {

        this.x += this.x_speed 
        this.y += this.y_speed 
        this.angle += this.rotation_speed 
        this.angle %= (2 * Math.PI)

        //return back if hit to the wall
        if (this.x + this.radius > ctx.canvas.width || this.x - this.radius < 0 ) {
            this.x_speed = - this.x_speed 
        }

        //to hit top and bottom
        if (this.y + this.radius > ctx.canvas.height || this.y - this.radius < 0 ) {
            this.y_speed = -this.y_speed
        }

        if ( 
            dock.y + this.radius < this.y &&
            dock.y + dock.height - this.radius > this.y &&
            dock.x < this.x &&
            dock.x + dock.width/2 > this.x
        ){
            this.x = dock.x + dock.width - this.radius
            this.y = dock.y + dock.height - this.radius
            this.x_speed = 0
            this.y_speed = 0
            this.in_dock = true
            
        } 

        //todo hit the dock top
        if (dock.y - this.radius < this.y && dock.y > this.y &&
            dock.x < this.x && dock.x + dock.width > this.x )
            this.y_speed = -this.y_speed

        //todo hit the dock bottom
        if (dock.y + dock.height + this.radius > this.y && dock.y + dock.height < this.y &&
            dock.x < this.x && dock.x + dock.width > this.x )
            this.y_speed = -this.y_speed

        //todo hit the dock right side
        if (dock.x + dock.width + this.radius > this.x && dock.x + dock.width - this.radius < this.x &&
            dock.y - this.radius < this.y && dock.y + dock.height + this.radius > this.y )
            this.x_speed = -this.x_speed

        //todo edge and corner cases
        //this.force = this.mass * Math.sqrt(this.x * this.x + this.y * this.y)
    
    }

    //to implement Newton’s second law:
    //to apply the force to the mass, causing acceleration, 
    //that is inversely proportional to the mass
    push (angle, force) {
        this.x_speed += (Math.cos(angle) * force) / this.mass
        this.y_speed += (Math.sin(angle) * force) / this.mass
    }
    //positive forces rotate the mass clockwise,
    //negative forces rotate the mass counterclockwise
    twist (force) {
        this.rotation_speed += force / this.mass;
    }

    //to calculate the speed and angle of movement of a Mass
    speed () {
        return Math.sqrt(Math.pow(this.x_speed, 2) + Math.pow(this.y_speed, 2))
    }
    movement_angle () {
        return Math.atan2(this.y_speed, this.x_speed);
    }

    draw (c) {
        c.save();
        c.translate(this.x, this.y)
        c.rotate(this.angle)
        c.beginPath()
        c.arc(0, 0, this.radius, 0, 2 * Math.PI)
        c.lineTo(0, 0)
        c.strokeStyle = "#FFFFFF"
        c.stroke()
        c.restore()
    }

    massCollisionDetected (c) {

    }

}

class Ship extends Mass {
    constructor(x, y, power) {
        super(x, y, 10, 20, 1.5 * Math.PI)
        this.right_thruster = false
        this.left_thruster = false
        this.up_thruster = false
        this.down_thruster = false

        this.compromised = false
        this.max_health = 2.0
        this.health = this.max_health
    }

    draw (c, guide) {
        c.save()
        c.translate(this.x, this.y)
        //c.rotate(this.angle)
        if (guide && this.compromised) {
            c.save()
            c.fillStyle = "red"
            c.beginPath()
            c.arc(0, 0, this.radius, 0, 2 * Math.PI)
            c.fill()
            c.restore()
        }
        draw_ship(c, this.radius, {
            guide: guide,
            right_thruster: this.right_thruster,
            left_thruster: this.left_thruster,
            up_thruster: this.up_thruster,
            down_thruster: this.down_thruster
        })
        c.restore()
    }

    update(context) {
        super.push(this.angle, (- this.up_thruster + this.down_thruster)/4)
        super.push(this.angle - Math.PI/2, (- this.left_thruster + this.right_thruster)/4)

        if (this.compromised) {
            this.health -= Math.min(this.health)/10
        }
        super.update(context)
    }

}

class Asteroid extends Mass {
    constructor(x, y, mass, x_speed, y_speed, rotation_speed) {
        
        let density = 1; // kg per square pixel
        let radius = Math.sqrt((mass / density) / Math.PI)
        //x, y, mass, radius, angle, x_speed, y_speed, rotation_speed
        super(x, y, mass, radius, 0, x_speed, y_speed, rotation_speed)
        this.circumference = 2 * Math.PI * this.radius
        this.segments = Math.ceil(this.circumference / 15)
        this.segments = Math.min(25, Math.max(10, this.segments))
        this.noise = 0.09
        this.shape = []

        for (let i = 0; i < this.segments; i++) {
           this.shape.push(2 * (Math.random() - 0.5))
        }
        
    }
    
    draw (ctx, guide) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        draw_asteroid(ctx, this.radius, this.shape, {
            noise: this.noise,
            guide: guide
        })
        ctx.restore()
    }

}

function draw_ship(ctx, radius, options) {
    options = options || {}
    let angle = (options.angle || 0.5 * Math.PI) / 2
    ctx.save()

    //ship
    ctx.lineWidth = options.lineWidth || 2
    ctx.strokeStyle = options.stroke || "orange"
    ctx.fillStyle = options.fill || "blue"
    ctx.beginPath() // draw the ship in four lines
    ctx.moveTo(-Math.sqrt((radius*radius)/2), -Math.sqrt((radius*radius)/2))//to statr draw a ship into moving context into origin
    ctx.quadraticCurveTo(0, 0, -Math.sqrt((radius*radius)/2), Math.sqrt((radius*radius)/2))
    ctx.quadraticCurveTo(0, 0, Math.sqrt((radius*radius)/2), Math.sqrt((radius*radius)/2))
    ctx.quadraticCurveTo(0, 0, Math.sqrt((radius*radius)/2), -Math.sqrt((radius*radius)/2))
    ctx.quadraticCurveTo(0, 0, -Math.sqrt((radius*radius)/2), -Math.sqrt((radius*radius)/2))

    ctx.fill()
    ctx.stroke()

    ctx.strokeStyle = "blue"
    ctx.lineWidth = 1
    ctx.fillStyle = "orange"
    ctx.beginPath()
    ctx.arc(0, 0, radius/2, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    ctx.strokeStyle = "blue"
    ctx.lineWidth = 1
    ctx.fillStyle = "yellow"
    ctx.beginPath()
    ctx.arc(0, 0, radius/4, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

     //if thrusters on
     //options.thruster_up = true
     //options.thruster_down = true
     //options.thruster_left = true
     //options.thruster_right = true
    if (options.up_thruster || options.down_thruster || 
        options.left_thruster || options.right_thruster ){
        for ( let i = 0; i < 4 ; i++) {
            ctx.strokeStyle = "yellow"
            ctx.fillStyle = "red"
            ctx.lineWidth = 3
            ctx.save()
            ctx.beginPath()
            if(options.left_thruster) {
                ctx.moveTo(- radius/2 - 2, - radius/4)
                ctx.quadraticCurveTo(- radius * 2, 0, - radius / 2 - 2, radius / 4)
            }
            if(options.right_thruster) {
                ctx.moveTo(+ radius/2 + 2, - radius/4)
                ctx.quadraticCurveTo(+ radius * 2, 0, radius / 2 + 2,  radius / 4)
            }
            if(options.up_thruster) {
                ctx.moveTo( - radius/4, - radius/2 - 2,)
                ctx.quadraticCurveTo(0, - radius * 2, radius / 4, - radius / 2 - 2, )
            }
            if(options.down_thruster) {
                ctx.moveTo( + radius/4, + radius/2 + 2,)
                ctx.quadraticCurveTo(0, + radius * 2, - radius / 4, + radius / 2 + 2, )
            }
            ctx.fill()
            ctx.stroke()
            ctx.restore()
        }
    }
    
    // a guide line and circle show the control point
    if (options.guide) {
        ctx.strokeStyle = "white"
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.arc(0, 0, radius, 0, 2 * Math.PI)
        ctx.stroke()
    }
    ctx.restore()
}

function draw_asteroid(ctx, radius, shape, options) {
    options = options || {}
    ctx.strokeStyle = options.stroke || "white"
    ctx.fillStyle = options.fill || "silver"
    ctx.save()
    ctx.beginPath()

    for (let i = 0; i < shape.length; i++) {
        ctx.rotate(2 * Math.PI / shape.length)
        ctx.lineTo(radius + radius * options.noise * shape[i], 0)
    }

    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    if (options.guide) {
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.arc(0, 0, radius, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.beginPath()
        ctx.lineWidth = 0.2
        ctx.arc(0, 0, radius + radius * options.noise, 0, 2 *Math.PI)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(0, 0, radius - radius * options.noise, 0, 2 *Math.PI)
        ctx.stroke()
    }
    ctx.restore()
}

function draw_grid(ctx, minor, major, stroke, fill) {
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

    c.save();

    c.strokeStyle = "red"
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo( dock.x -20 , dock.y - 20,);
    c.lineTo( dock.x + dock.width + 20 , dock.y - 20,);
    c.stroke(); 
    c.closePath();

    c.strokeStyle = "orange"
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo( dock.x -20 , dock.y +10 ,);
    c.lineTo( dock.x + dock.width + 20 , dock.y +10 );
    c.stroke(); 
    c.closePath();

    c.strokeStyle = "yellow"
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo( dock.x + dock.width + 20 , dock.y - 20);
    c.lineTo( dock.x + dock.width + 20 , dock.y + dock.height + 20);
    c.stroke(); 
    c.closePath();

    c.strokeStyle = "orange"
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo( dock.x + dock.width - 10 , dock.y - 20);
    c.lineTo( dock.x + dock.width -10 , dock.y + dock.height + 20);
    c.stroke(); 
    c.closePath();

    c.strokeStyle = "red"
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo( dock.x + dock.width + 20  , dock.y + dock.height + 20);
    c.lineTo( dock.x -20 , dock.y + dock.height + 20);
    c.stroke(); 
    c.closePath();

    c.strokeStyle = "orange"
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo( dock.x + dock.width + 20  , dock.y + dock.height - 10 ,);
    c.lineTo( dock.x -20 , dock.y + dock.height - 10  );
    c.stroke(); 
    c.closePath();

    c.restore();
}

//to show thrusters for test and dev only
function key_handler(e, value) {
    var nothing_handled = false;
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

function draw_line(ctx, obj1, obj2) {
    ctx.save()
    ctx.strokeStyle = "white"
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(obj1.x, obj1.y)
    ctx.lineTo(obj2.x, obj2.y)
    ctx.stroke()
    ctx.restore()
}

function collision(obj1, obj2) {
    console.log()
    return distance_between(obj1, obj2) < (obj1.radius + obj2.radius)
}
function distance_between(obj1, obj2) {
    return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2))
}

//todo solve sensor values
function updateShipThrusters (sensor_values) {
    try {
        if (sensor_values.x < 0)
            return

        //ship.up_thruster
        if (sensor_values.z > 3.5 && sensor_values.z < 6.5){
            ship.up_thruster = true
            setTimeout(() => { ship.up_thruster = false }, 500)
        }

        if (sensor_values.z > 6.5){
            ship.up_thruster = true
            setTimeout(() => { ship.up_thruster = false }, 1000)
        }
        // ship.down_thruster 
        if (sensor_values.z < -3.5 && sensor_values.z > - 6.5){
            ship.down_thruster = true
            setTimeout(() => { ship.down_thruster = false }, 500)
        }

        if (sensor_values.z < - 6.5){
            ship.down_thruster = true
            setTimeout(() => { ship.down_thruster = false }, 1000)
        }
        //ship.right_thruster
        if (sensor_values.y > 3.5 && sensor_values.y < 6.5){
            ship.right_thruster = true
            setTimeout(() => { ship.right_thruster = false }, 500)
        }

        if (sensor_values.y > 6.5){
            ship.right_thruster = true
            setTimeout(() => { ship.right_thruster = false }, 1000)
        }

        //ship.left_thruster
        if (sensor_values.y < -3.5 && sensor_values.y > - 6.5){
            ship.left_thruster = true
            setTimeout(() => { ship.left_thruster = false }, 500)
        }

        if (sensor_values.y < - 6.5){
            ship.left_thruster = true
            setTimeout(() => { ship.left_thruster = false }, 1000)
        }

        //TODO
        //ship.update(c) 

    } catch (err) {
        console.log(err)
    }
}