class Paddle {
  constructor() {
    this.position = createVector(mouseX, mouseY);
    this.velocity = createVector(0, 0);
    this.radius = 90;
  }
  update() {
    this.mouseSpeed = createVector(mouseX - this.position.x, mouseY - this.position.y);
    this.velocity = p5.Vector.add(this.velocity.copy().mult(0.8), this.mouseSpeed.mult(0.2));
    this.position.add(this.mouseSpeed.mult(0.8));
  }
  display() {
    fill(0, 0, 255);
    ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
  }
  reflect(incident, axis) {
    let d = incident;
    let n = axis.normalize();
    let scaler = 2 * (d.x * n.x + d.y * n.y);
    let r = p5.Vector.sub(d, n.mult(scaler));
    return r;
  }

  handleCollision(ball) {
    let directionVector = p5.Vector.sub(ball.position, this.position);
    let distance = directionVector.mag();
    if (distance - ball.radius - this.radius < 5) {
      ball.velocity = this.reflect(p5.Vector.add(ball.velocity, this.velocity), directionVector);
      ball.velocity.mult(directionVector.mag() + ball.velocity.mag());
      ball.position = p5.Vector.add(this.position, directionVector.normalize().mult(this.radius * 1.1));
      ball.position.add(ball.velocity / precision);
    }
  }
}
