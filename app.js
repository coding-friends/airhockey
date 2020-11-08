"use strict";
const path = require("path")
const PORT = process.env.PORT || 5000
const ROOT_DIR = __dirname 

const FPS = 30;
const PRECISION = 100;
const FRICTION = 1 - 1e-4 /2;
const WIDTH = 2000;
const HEIGHT = 1000;
const BALLV = 2;
const BALLR = 20;
const PLAYERR = 80;
const CIRCLE_D = HEIGHT / 3;
const CENTER = HEIGHT / 2;
const CIRCLE_R = CIRCLE_D / 2;
let running = false;
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require("socket.io")(http)


function initStates() {
  game.ballX = WIDTH / 2;
  game.ballY = HEIGHT / 2;
  game.playerAX = 200;
  game.playerAY = HEIGHT / 2;
  game.playerBX = WIDTH - 200;
  game.playerBY = HEIGHT / 2;
  hid.ballVX = Math.random() * (2 * BALLV) - BALLV;
  hid.ballVY = Math.random() * (2 * BALLV) - BALLV;
  game.message = "";
}

let clients = [];
const game = {};
const hid = {};
initStates();

function startOrStop() {
  let before = running;
  if (clients.length >= 2) {
    running = true;
    hid.message = "running";
  } else {
    running = false;
    hid.message = "paused";
  }
  if (before != running) initStates();
}

function distance(ax, ay, bx, by) {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

function ballPaddleBounce(px, py) {
  //handle ball Player
  let length = distance(px, py, game.ballX, game.ballY);
  let cross = length - PLAYERR - BALLR;
  if (cross < 0) {
    let ratio = (-cross / length) * 0.01;
    let accX = (px - game.ballX) * ratio;
    let accY = (py - game.ballY) * ratio;
    // console.log({ accX, accY, ratio, px, py, ballX: game.ballX, ballY: game.ballY });
    hid.ballVX -= accX;
    hid.ballVY -= accY;
  }
}

function processDelta(delta) {
  if (game.ballX - BALLR < 0 || game.ballX + BALLR > WIDTH) {
    if (game.ballY - BALLR > CENTER - CIRCLE_R && game.ballY + BALLR < CENTER + CIRCLE_R) {
      initStates();
    } else {
      hid.ballVX *= -1;
    }
  }

  if (game.ballY - BALLR < 0 || game.ballY + BALLR > HEIGHT) hid.ballVY *= -1;
  // move the ball
  game.ballX += hid.ballVX * delta;
  game.ballY += hid.ballVY * delta;
  //Adding friction
  hid.ballVX *= FRICTION;
  hid.ballVY *= FRICTION;
  // handle ball A collision
  ballPaddleBounce(game.playerAX, game.playerAY);
  // handle ball B collision
  ballPaddleBounce(game.playerBX, game.playerBY);
}

io.on("connection", (socket) => {
  console.log("user connected")
  clients.push(socket);
  socket.on("disconnect", () => {
    console.log("a player disconnected");
    clients.splice(clients.indexOf(socket), 1);
    startOrStop();
  });
  socket.on("message", (m) => {
    let mousePos = m
    const yPos = Math.max(Math.min(mousePos.y, HEIGHT - PLAYERR), PLAYERR);
    switch (clients.indexOf(socket)) {
      case 0:
        game.playerAX = Math.max(Math.min(mousePos.x, WIDTH / 2 - PLAYERR), PLAYERR);
        game.playerAY = yPos
        break;
      case 1:
        game.playerBX = Math.max(Math.min(mousePos.x, WIDTH - PLAYERR), WIDTH / 2 + PLAYERR);
        game.playerBY = yPos;
        break;
    }
  });
  startOrStop();
});

let lastFrame = Date.now();

setInterval(() => {
  let delta = 1;
  if (running) for (var i = 0; i < PRECISION; i++) processDelta(delta / PRECISION);
  // sending data to all clients
  clients.forEach((s, i) => {
    game.role = i
    s.emit("message", game)
  });
  lastFrame = Date.now();
}, 1000 / FPS);

app.use(express.static(ROOT_DIR))
http.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`)
})
