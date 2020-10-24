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
  //   for (let i = 0; i < precision; i++) {
  //     ball.handleWalls();
  //     ball.update();
  //     paddleA.update();
  //     paddleA.handleCollision(ball);
  //   }
  line(WIDTH / 2, 0, WIDTH / 2, HEIGHT);
  noFill();
  ellipse(WIDTH / 2, HEIGHT / 2, CIRCLE_SIZE);
  ellipse(0, HEIGHT / 2, CIRCLE_SIZE);
  ellipse(WIDTH, HEIGHT / 2, CIRCLE_SIZE);

  ball.display();
  paddleA.display();
  paddleB.display();
}

const { Model, T } = bufc;
const inputModel = new Model({
  x: T.uint16,
  y: T.uint16,
});
const outputModel = new Model({
  playerAX: T.uint16,
  playerAY: T.uint16,
  playerBX: T.uint16,
  playerBY: T.uint16,
  ballX: T.uint16,
  ballY: T.uint16,
  role: T.uint8, // 0: playerA, 1: playerB, 2: visitor
  message: T.string(T.uint8, T.uint8),
});
let socket = new WebSocket(prompt("Please enter the server url"));
socket.onopen = (e) => {
  console.log("connected to server");
  setInterval(() => {
    socket.send(
      inputModel.serialize({
        x: Math.max(mouseX, 0),
        y: Math.max(mouseY, 0),
      })
    );
  }, 1000 / 60);
};
socket.onmessage = (e) => {
  (async () => {
    let data = outputModel.parse(await e.data.arrayBuffer());
    paddleA.position.x = data.playerAX;
    paddleA.position.y = data.playerAY;
    paddleB.position.x = data.playerBX;
    paddleB.position.y = data.playerBY;
    ball.position.x = data.ballX;
    ball.position.y = data.ballY;
  })();
};
socket.onclose = (e) => {
  console.log(e);
};
