let ball, paddle, precision =1000
function setup(){
    createCanvas(800,800)
    ball = new Ball(width/2,height/2)
    paddle = new Paddle()
}
function draw(){
    background(51)
    for (let i =0 ; i < precision; i++){
        ball.handleWalls()
        ball.update()
        paddle.update()
        paddle.handleCollision(ball)
    }
    ball.display()

    paddle.display()


}
