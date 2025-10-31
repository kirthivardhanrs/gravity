let c1 = document.getElementById("canvas1");
let c2 = document.getElementById("canvas2");

let btn = document.getElementById("startBtn");
let inputX = document.getElementById("inputX");
let inputY = document.getElementById("inputY");
let inputVx = document.getElementById("inputVx");
let inputVy = document.getElementById("inputVy");

let xVal = document.getElementById("xVal");
let yVal = document.getElementById("yVal");
let vxVal = document.getElementById("vxVal");
let vyVal = document.getElementById("vyVal");

let animating = false;

inputX.max = window.innerWidth;
inputY.max = window.innerHeight;

[inputX, inputY, inputVx, inputVy].forEach(slider => {
  slider.addEventListener("input", () => {
    if (slider === inputX) xVal.innerHTML = slider.value;
    if (slider === inputY) yVal.innerHTML = slider.value;
    if (slider === inputVx) vxVal.innerHTML = slider.value;
    if (slider === inputVy) vyVal.innerHTML = slider.value;

    if (!animating) {
        drawPreview();
    }
  });
});


c1.width = c2.width = window.innerWidth;
c1.height = c2.height = window.innerHeight;

let ctx1 = c1.getContext("2d");
let ctx2 = c2.getContext("2d");

ctx1.fillStyle = "white";
ctx1.strokeStyle = "white";

const sun = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  radius: 25,
  color: "white",
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  },
};

const ball = {
  x: 100,
  y: 100,
  vx: 10,
  vy: 0,
  ax: 0,
  ay: 0,
  radius: 10,
  color: "white",
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  },
};

let lastTime = performance.now();
let lastX = ball.x;
let lastY = ball.y;

let dx, dy, d, g, dir_x, dir_y, dt;

function draw(currentTime) {
  dt = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  dx = sun.x - ball.x;
  dy = sun.y - ball.y;
  d = Math.sqrt(dx**2 + dy**2);
  g = 1000000 / (d**2) - 10000000/(d**3);
  //g = 1000000 / (d**2)
  dir_x = dx / d;
  dir_y = dy / d;

  ball.ax = g * dir_x;
  ball.ay = g * dir_y;
  ball.vx += ball.ax * dt;
  ball.vy += ball.ay * dt;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;

  ctx1.clearRect(0, 0, window.innerWidth, window.innerHeight);
  sun.draw(ctx1);
  ball.draw(ctx1);

  ctx2.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx2.lineWidth = 2;
  ctx2.beginPath();
  ctx2.moveTo(lastX, lastY);
  ctx2.lineTo(ball.x, ball.y);
  ctx2.stroke();

  lastX = ball.x;
  lastY = ball.y;

  if (d < sun.radius || ball.x > window.innerWidth || ball.x <  0 || ball.y < 0 || ball.y > window.innerHeight) {
    animating = false;
  }

  if (animating) requestAnimationFrame(draw);
}

sun.draw(ctx1);

btn.addEventListener("click", () => {

  ball.x = Number(inputX.value);
  ball.y = Number(inputY.value);
  ball.vx = Number(inputVx.value);
  ball.vy = Number(inputVy.value);

  ctx2.clearRect(0, 0, c2.width, c2.height);

  lastTime = performance.now();
  lastX = ball.x;
  lastY = ball.y;

  animating = true;
  requestAnimationFrame(draw);
});

function drawPreview() {
    ctx1.clearRect(0, 0, c1.width, c1.height);
    sun.draw(ctx1);

    ball.x = Number(inputX.value);
    ball.y = Number(inputY.value);
  
    ball.draw(ctx1);
  }
  

