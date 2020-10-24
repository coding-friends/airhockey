class Paddle {
  constructor(color) {
    this.position = createVector(mouseX, mouseY);
    this.velocity = createVector(0, 0);
    this.radius = 50;
    this.color = color;
  }
  update() {
    this.mouseSpeed = createVector(mouseX - this.position.x, mouseY - this.position.y);
    this.velocity = p5.Vector.add(this.velocity.copy().mult(0.8), this.mouseSpeed.mult(0.2));
    this.position.add(this.mouseSpeed.mult(0.8));
  }
  display() {
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
  }
  reflect(incident, axis) {
    let d = incident;
    let n = axis.normalize();
    let scaler = 2 * (d.x * n.x + d.y * n.y);
    let r = p5.Vector.sub(d, n.mult(scaler));
    return r;
  }

  // handleCollision(ball) {
  //   let directionVector = p5.Vector.sub(ball.position, this.position);
  //   let distance = directionVector.mag();
  //   if (distance - ball.radius - this.radius < 5) {
  //     ball.velocity = this.reflect(p5.Vector.add(ball.velocity, this.velocity), directionVector);
  //     ball.velocity.mult(directionVector.mag() + ball.velocity.mag());
  //     ball.position = p5.Vector.add(this.position, directionVector.normalize().mult(this.radius * 1.1));
  //     ball.position.add(ball.velocity / precision);
  //   }
  // }
  decomposeVector(vector, axis) {
    // decompose vector of balls velocity into velocity that is colliding between the two and velocity that is perpendicular, then negate the vector that is colliding between the two and add it to the perpendicular velocity
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
