class Enemy {
    constructor (x, y, radius, color, velocity) {
        this.x = x - BODY_MARGIN
        this.y = y - BODY_MARGIN
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
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Player {
    constructor (x, y, radius, color) {
        this.x = x - BODY_MARGIN
        this.y = y - BODY_MARGIN
        this.radius = radius
        this.color = color
    }
    draw () {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
        c.fillStyle = this.color
        c.fill()
    }
    remove () {
        this.draw()
        this.color = 'black'
    } 
}

class Projectile {
    constructor (x, y, radius, color, velocity) {
        this.x = x - BODY_MARGIN
        this.y = y - BODY_MARGIN
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
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

const friction = 0.98
class Particle {
    constructor (x, y, radius, color, velocity) {
        this.x = x - BODY_MARGIN
        this.y = y - BODY_MARGIN
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

const BODY_MARGIN = 15 //see body style
const HIT_ENEMY = 100
const KILL_ENEMY = 250

hitEnemy.innerHTML = HIT_ENEMY
killEnemy.innerHTML = KILL_ENEMY

const x = canvas.width / 2
const y = canvas.height / 2
let player = new Player(x, y, 10, 'white')
let projectiles = []
let enemies = []
let particles = []