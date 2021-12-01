
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
        c.roundRect(this.x, this.y, this.width, this.height, [10])
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
    }

    //to implement Newton’s first law:
    update (elapsed, ctx) {
        this.x += this.x_speed * elapsed
        this.y += this.y_speed * elapsed
        this.angle += this.rotation_speed * elapsed
        this.angle %= (2 * Math.PI)

        if(this.x - this.radius > ctx.canvas.width) {
            this.x = -this.radius
        }
        if(this.x + this.radius < 0) {
            this.x = ctx.canvas.width + this.radius
        }
        if(this.y - this.radius > ctx.canvas.height) {
            this.y = -this.radius
        }
        if(this.y + this.radius < 0) {
            this.y = ctx.canvas.height + this.radius
        }
    }

    //to implement Newton’s second law:
    //to apply the force to the mass, causing acceleration, 
    //that is inversely proportional to the mass
    push (angle, force, elapsed) {
        this.x_speed += elapsed * (Math.cos(angle) * force) / this.mass
        this.y_speed += elapsed * (Math.sin(angle) * force) / this.mass
    }
    //positive forces rotate the mass clockwise,
    //negative forces rotate the mass counterclockwise
    twist (force, elapsed) {
        this.rotation_speed += elapsed * force / this.mass;
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

}

class Ship extends Mass {
    constructor(x, y, power) {
        super(x, y, 10, 20, 1.5 * Math.PI)
        this.thruster_power = power
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
        c.rotate(this.angle)
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
            thruster: this.thruster_on
        })
        c.restore()
    }

    update(elapsed, context) {
        super.push(this.angle, (this.up_thruster - this.down_thruster) * this.thruster_power, elapsed)
        super.push(this.angle, (this.left_thruster - this.right_thruster) * this.thruster_power, elapsed)
        //super.twist(
         //   (this.right_thruster - this.left_thruster) * this.steering_power, 
        //    elapsed
        //) 
        /*
        this.loaded = this.time_until_reloaded === 0
            if(!this.loaded) {
            this.time_until_reloaded -= Math.min(elapsed, this.time_until_reloaded)
        } */
        if (this.compromised) {
            this.health -= Math.min(elapsed, this.health)/10
        }
        super.update(elapsed, context)
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
        this.segments = Math.min(25, Math.max(5, this.segments))
        this.noise = 0.15
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
    let curve1 = options.curve1 || 0.25
    let curve2 = options.curve2 || 0.75
    
    ctx.save();
    // optionally draw a guide showing the collision radius
    if (options.guide) {
        ctx.strokeStyle = "white"
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)"
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.arc(0, 0, radius, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.fill()
    }
    
    // set default values
    ctx.lineWidth = options.lineWidth || 2
    ctx.strokeStyle = options.stroke || "white"
    ctx.fillStyle = options.fill || "black"
    ctx.beginPath() // draw the ship in three lines
    ctx.moveTo(radius, 0) //to strat draw a ship into moving context into origin
    ctx.quadraticCurveTo(
        Math.cos(angle) * radius * curve2,
        Math.sin(angle) * radius * curve2,
        Math.cos(Math.PI - angle) * radius,
        Math.sin(Math.PI - angle) * radius
    )
    ctx.quadraticCurveTo(
        -radius * curve1, 
        0,
        Math.cos(Math.PI + angle) * radius,
        Math.sin(Math.PI + angle) * radius
    )
    ctx.quadraticCurveTo(
        Math.cos(-angle) * radius * curve2,
        Math.sin(-angle) * radius * curve2, 
        radius, 
        0
    );
    ctx.fill()
    ctx.stroke()

    //thruster
    if(options.thruster) {
        ctx.save()
        ctx.strokeStyle = "yellow"
        ctx.fillStyle = "red"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(
            Math.cos(Math.PI + angle * 0.8) * radius / 2,
            Math.sin(Math.PI + angle * 0.8) * radius / 2
        )
        ctx.quadraticCurveTo(-radius * 2, 0,
            Math.cos(Math.PI - angle * 0.8) * radius / 2,
            Math.sin(Math.PI - angle * 0.8) * radius / 2
        );
        ctx.fill()
        ctx.stroke()
        ctx.restore()
    }

    // a guide line and circle show the control point
    if (options.guide) {
        ctx.strokeStyle = "white"
        ctx.fillStyle = "white"
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(
            Math.cos(-angle) * radius,
            Math.sin(-angle) * radius
        )
        ctx.lineTo(0, 0);
        ctx.lineTo(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius
        )
        ctx.moveTo(-radius, 0)
        ctx.lineTo(0, 0)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(
            Math.cos(angle) * radius * curve2,
            Math.sin(angle) * radius * curve2,
            radius/40, 0, 2 * Math.PI
        )
        ctx.fill()
        ctx.beginPath()
        ctx.arc(
            Math.cos(-angle) * radius * curve2,
            Math.sin(-angle) * radius * curve2,
            radius/40, 0, 2 * Math.PI
        )
        ctx.fill()
        ctx.beginPath()
        ctx.arc(radius * curve1 - radius, 0, radius/50, 0, 2 *Math.PI)
        ctx.fill()
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
}

//to show thrusters
function key_handler(e, value) {
    var nothing_handled = false;
    switch(e.key || e.keyCode) {
        case "ArrowUp":
        case 38: // up arrow
            ship.thruster_on = value
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
            ship.retro_on = value
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
    return distance_between(obj1, obj2) < (obj1.radius + obj2.radius)
}
function distance_between(obj1, obj2) {
    return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2))
}