const COUNT = 10;
const radius = 30;
let speed = 1.5;
let width = 500, height = 500,
frameRate = 10;

const colors = [
            'coral', 
            'lightblue', 
            'lightgrey', 
            'lightgreen'
        ];

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
    
    return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        const angle = -Math.atan2(yDist, xDist);

        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        particle.velocity.x = u2.x;
        particle.velocity.y = u2.y;

        otherParticle.velocity.x = u1.x;
        otherParticle.velocity.y = u1.y;
    }
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
  }

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

function getDistance(x1, y1, x2, y2) {
    const xDist = x2 - x1;
    const yDist = y2 - y1;
  
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
  }

function Circle(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = {
        x: Math.random() * speed,
        y: Math.random() * speed
    };
    this.radius = radius;
    this.color = color;

    this.update = circles => {
        this.draw();

        for(let i = 0; i < circles.length; i++) {
            if(this === circles[i]) continue;

            if(getDistance(this.x, this.y, circles[i].x, circles[i].y) - this.radius * 2 < 0 ) {
                resolveCollision(this, circles[i]);
            }
        }

        if(this.x - this.radius <= 0 || this.x + this.radius >= width) {
            this.velocity.x =- this.velocity.x;
        }

        if(this.y - this.radius <= 0 || this.y + this.radius >= height) {
            this.velocity.y =- this.velocity.y;
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    };

    this.draw = () => {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0,
            Math.PI *2, false);
        context.fillStyle = this.color; 
        context.fill(); 
        context.closePath();

    }
}

let circles = [];

function init() {
   circles = [];

   for(let i = 0; i < COUNT; i++)
   {
        let x = randomIntFromRange(radius, width - radius);
        let y = randomIntFromRange(radius, height - radius);

        const color = randomColor(colors);

       if(i != 0) {
            for (let j = 0; j < circles.length; j++) {
                if(getDistance(x, y, circles[j].x, circles[j].y) 
                    - radius * 2 < 0 ) {
                        x = randomIntFromRange(radius, width - radius);
                        y = randomIntFromRange(radius, height - radius);

                        j = -1;
                }
            }
        }
        circles.push(new Circle(x, y, radius, color));
    }

}

function animate(){
    context.clearRect(0,0, width, height);

    circles.forEach(circle => {
        circle.update(circles)
    });
}
window.onload = function() {

    canvas = document.getElementById('canvas');
    canvas.height = height;
    canvas.width = width;

    context = canvas.getContext('2d');

    init();
    setInterval(animate, frameRate);
    
}