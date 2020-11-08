class Paddle {
  constructor(color) {
    this.position = createVector(mouseX, mouseY);
    this.velocity = createVector(0, 0);
    this.radius = 80;
    this.color = color;
  }
  update() {
    this.mouseSpeed = createVector(mouseX - this.position.x, mouseY - this.position.y);
    this.velocity = p5.Vector.add(this.velocity.copy().mult(0.8), this.mouseSpeed.mult(0.2));
    this.position.add(this.mouseSpeed.mult(0.8));
  }
  display() {
    fill(this.color);
    ellipse(Math.round(this.position.x), Math.round(this.position.y), this.radius * 2, this.radius * 2);
  }
  reflect(incident, axis) {
    let d = incident;
    let n = axis.normalize();
    let scaler = 2 * (d.x * n.x + d.y * n.y);
    let r = p5.Vector.sub(d, n.mult(scaler));
    return r;
  }

  handleCollision(ball) {
    let length = this.position.copy().sub(ball.position).mag();
    let cross = length - this.radius - ball.radius;
    if (cross < 0) {
      let ratio = -cross / length;
      let acc = this.position.copy().sub(ball.position).mult(ratio);
      ball.velocity.sub(acc);
    }
  }
}
