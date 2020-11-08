class Ball {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 8);
    this.acceleration = createVector(0, 0);
    this.maxVelocity = 10;
    this.radius = 20;
    this.state = true;
  }

  update() {
    this.velocity.limit(this.maxVelocity);
    this.position.add(this.velocity.copy().mult(1 / precision));
  }

  display() {
    fill(30);
    ellipse(Math.round(this.position.x), Math.round(this.position.y), this.radius * 2, this.radius * 2);
  }

  handleWalls() {
    const x = this.position.x;
    const y = this.position.y;
    if (x < this.radius || x > width - this.radius) {
      this.velocity.x *= -1;
    }

    if (y < this.radius || y > height - this.radius) {
      this.velocity.y *= -1;
    }
  }
}
