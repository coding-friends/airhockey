const { T, Model } = require("./bufc");

module.exports = new Model({
  x: T.uint16,
  y: T.uint16,
});
