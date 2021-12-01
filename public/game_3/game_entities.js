class Rocket {
    constructor (x, y, radius, color, velocity) {
        this.x = x
        this.y = y 
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw () {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
        c.fillStyle = this.color
        c.fill()
    }
    update() {
        this.draw()
        //c.save()
        //c.translate(this.x, this.y)

        //this.x = this.x + this.velocity.x
        //this.y = this.y + this.velocity.y
        console.log(x + ' in update ' +i)
    }
}

class Dock {
    constructor (x, y, width, height, color) {
        this.x = x
        this.y = y 
        this.width = width 
        this.height = height 
        this.color = color
    }
    draw () {
        c.beginPath()
        c.roundRect(this.x, this.y, this.width, this.height, [10])
        //c.rect(this.x, this.y, this.width, this.height)
        c.fillStyle = this.color
        c.fill()

        c.lineWidth = 6
        c.strokeStyle =  "rgb(14, 61, 88)"
        c.stroke()
    }
}

class Dock_door {
    constructor (x, y, height, color) {
        this.x = x
        this.y = y 
        this.height = height 
        this.color = color
    }
    draw () {
        c.beginPath()
        c.rect(this.x - 5, this.y - 5, 15, this.height + 10)
        c.fillStyle = this.color 
        c.fill()
    }
}

const friction = 0.98
class Particle {
    constructor (x, y, radius, color, velocity) {
        this.x = x 
        this.y = y 
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1 //always 1, to fade out over time
    }
    draw () {
        c.save() //put game into a state
        c.GlobalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
        c.fillStyle = this.color
        c.fill()
        c.restore() //finish of state
    }
    update() {
        this.draw()
        this.velocity.x *= friction //to enhace disapeare efekt
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01 //slowly to fade out
    }
}