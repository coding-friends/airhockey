const { T, Model } = require("./bufc");

module.exports = new Model({
  playerAX: T.uint16,
  playerAY: T.uint16,
  playerBX: T.uint16,
  playerBY: T.uint16,
  ballX: T.uint16,
  ballY: T.uint16,
  role: T.uint8, // 0: playerA, 1: playerB, 2: visitor
  message: T.string(T.uint8, T.uint8),
});
