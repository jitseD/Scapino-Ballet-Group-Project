const $canvas = document.querySelector(`.canvas`);
const canvas = { ctx: null, height: innerHeight, width: innerWidth };
let square;
let circle;
let g;
let wind;
let mouseIsPressed = false;

const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const createCanvas = () => {
    canvas.ctx = $canvas.getContext(`2d`);
    const scale = window.devicePixelRatio;
    $canvas.width = Math.floor(canvas.width * scale);
    $canvas.height = Math.floor(canvas.height * scale);
    canvas.ctx.scale(scale, scale);
    $canvas.style.width = `${canvas.width}px`;
    $canvas.style.height = `${canvas.height}px`;
}

const animateSquare = () => {
    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mouseIsPressed) square.applyForce(wind);

    square.applyForce(g);
    square.update();
    square.checkEdges();
    square.show();

    requestAnimationFrame(animateSquare);
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        this.x = this.x + vector.x;
        this.y = this.y + vector.y;
    }

    mult(n) {
        this.x = this.x * n;
        this.y = this.y * n;
    }

    div(n) {
        this.x = this.x / n;
        this.y = this.y / n;
    }

    limit(max) {
        if (this.mag() > max) {
            this.normalize();
            this.mult(max);
        }
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        let m = this.mag();
        if (m > 0) {
            this.div(m);
        }
    }
}

class Mover {
    constructor() {
        this.size = 50;
        this.pos = new Vector(randomNumber(0, canvas.width - this.size), canvas.height / 2);
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this.mass = this.size / 5;
        this.topSpeed = 20;
        this.fill = `black`;
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);

        // this.vel.limit(this.topSpeed);
        this.acc.mult(0);
    }

    show() {
        canvas.ctx.fillStyle = this.fill;
        canvas.ctx.fillRect(this.pos.x, this.pos.y, this.size, this.size);
    }

    applyForce(force) {
        let f = new Vector(force.x, force.y);
        f.div(this.mass);
        this.acc.add(f);
    }

    checkEdges() {
        if (this.pos.x + this.size > canvas.width) {
            this.pos.x = canvas.width - this.size;
            this.vel.x *= -1;
        } else if (this.pos.x < 0) {
            this.pos.x = 0;
            this.vel.x *= -1;
        }

        if (this.pos.y + this.size > canvas.height) {
            this.pos.y = canvas.height - this.size;
            this.vel.y *= -1;
        } else if (this.pos.y < 0) {
            this.pos.y = 0;
            this.vel.y *= -1;
        }
    }
}

const mouseDownHandle = e => {
    mouseIsPressed = true;
}

const mouseUpHandle = e => {
    mouseIsPressed = false;
}

const init = () => {
    createCanvas();
    square = new Mover();
    circle = new Mover();
    g = new Vector(0, 0.1);
    g.mult(square.mass);
    wind = new Vector(0.5, 0);

    $canvas.addEventListener(`mousedown`, mouseDownHandle);
    $canvas.addEventListener(`mouseup`, mouseUpHandle);
    animateSquare();
}

init();