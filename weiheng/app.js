"use strict";

const FPS = 30;
const PRECISION = 100;
const SIZE = 800;
const BALLV = 10;
const BALLR = 10;
const PLAYERR = 30;
let running = false;

const inputModel = require("./inputModel");
const outputModel = require("./ouputModel");

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

function initStates() {
  game.ballX = SIZE / 2;
  game.ballY = SIZE / 2;
  game.playerAX = 200;
  game.playerAY = SIZE / 2;
  game.playerBX = SIZE - 200;
  game.playerBY = SIZE / 2;
  hid.ballVX = Math.random() * (2 * BALLV) - BALLV;
  hid.ballVY = Math.random() * (2 * BALLV) - BALLV;
  game.message = "";
}

const clients = [];
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
  return Math.sqrt((ax - bx) ** 2 + (ay, by) ** 2);
}

function ballPaddleBounce(px, py) {
  //handle ball Player
  let length = distance(px, py, game.ballX, game.ballY);
  let inter = length - PLAYERR - BALLR;
  if (inter < 0) {
    // Getting the acc offset vector
    let ratio = inter / length;
    let accX = Math.abs(px - game.ballX) * ratio;
    let accY = Math.abs(py - game.ballY) * ratio;
    hid.ballVX -= accX;
    hid.ballVY -= accY;
  }
}

function process(delta) {
  //handle ball wall collision
  if (game.ballX - BALLR < 0 || game.ballX + BALLR > SIZE) hid.ballVX *= -1;
  if (game.ballY - BALLR < 0 || game.ballY + BALLR > SIZE) hid.ballVY *= -1;
  // handle ball A collision
  ballPaddleBounce(game.playerAX, game.playerAY);
  // handle ball A collision
  ballPaddleBounce(game.playerBX, game.playerBY);
  // move the ball
  game.ballX += hid.ballVX * delta;
  game.ballY += hid.ballVY * delta;
}

wss.on("connection", (s) => {
  clients.push(s);
  startOrStop();
  s.once("disconnect", () => {
    clients.splice(clients.indexOf(s), 1);
    startOrStop();
  });
  s.on("message", (m) => {
    let mousePos = inputModel.parse(m);
    switch (clients.indexOf(s)) {
      case 0:
        game.playerAX = mousePos.ballX;
        game.playerAY = mousePos.ballY;
        break;
      case 1:
        game.playerBX = mousePos.ballX;
        game.playerBY = mousePos.ballY;
        break;
    }
  });
});

let lastFrame = Date.now();
setInterval(() => {
  let delta = Date.now() - lastFrame;
  if (running) for (var i = 0; i < PRECISION; i++) process(delta / PRECISION);
  // sending data to all clients
  clients.forEach((s, i) => {
    switch (i) {
      case 0:
        game.role = 0;
        s.send(outputModel.serialize(game));
        break;
      case 1:
        game.role = 1;
        s.send(outputModel.serialize(game));
        break;
      default:
        game.role = 2;
        s.send(outputModel.serialize(game));
        break;
    }
  });
  lastFrame = Date.now();
}, 1000 / FPS);

console.log(outputModel.serialize(game));
