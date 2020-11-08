let ball,
  paddleA,
  paddleB,
  precision = 1000;

const WIDTH = 2000,
  HEIGHT = 1000,
  CIRCLE_SIZE = HEIGHT / 3;

function setup() {
  let p5canvas = createCanvas(WIDTH, HEIGHT);
  p5canvas.canvas.style = "";
  ball = new Ball(width / 2, height / 2);
  paddleA = new Paddle("red");
  paddleB = new Paddle("blue");
}
function draw() {
  background(255);
  line(WIDTH / 2, 0, WIDTH / 2, HEIGHT);
  noFill();
  ellipse(WIDTH / 2, HEIGHT / 2, CIRCLE_SIZE);
  ellipse(0, HEIGHT / 2, CIRCLE_SIZE);
  ellipse(WIDTH, HEIGHT / 2, CIRCLE_SIZE);

  ball.display();
  paddleA.display();
  paddleB.display();
}

let socket = io()
socket.on("connect",()=> {
  console.log("connected to server");
  setInterval(() => {
    let mousePos = {
      x: Math.max(mouseX, 0),
      y: Math.max(mouseY, 0),
    }
    socket.emit("message",mousePos);
  }, 1000 / 30);
});
socket.on("message",(data)=>{
    paddleA.position.x = data.playerAX;
    paddleA.position.y = data.playerAY;
    paddleB.position.x = data.playerBX;
    paddleB.position.y = data.playerBY;
    ball.position.x = data.ballX;
    ball.position.y = data.ballY;
});

