var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d") // the ctx variable stores the 2D rendering context

var score = 0;

// Paddle data
var paddleHeight = 10;
var paddleWidth = 140;
var paddleX = (canvas.width-paddleWidth)/2;
var paddleSpeed = 8;

// Ball data
var radius = 10
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 4;
var dy = -dx;

// Bricks
var bricksColor = [180, 0, 210]
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}


function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = 'rgb(' + String(bricksColor[0]) +','+ String(bricksColor[1])+',' + String(bricksColor[2]) +')';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}



function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2);
    ctx.fillStyle = "#E3F2FD";
    ctx.fill();
    ctx.closePath();
}

var rightPressed = false;
var leftPressed = false;

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = 'rgb(' + String(bricksColor[0]) +','+ String(bricksColor[1])+',' + String(bricksColor[2]) +')';
    ctx.fill();
    ctx.closePath();
}

function keyDownHandler(e) {
  if(e.keyCode == 39){
    rightPressed = true;
  }
  else if(e.keyCode == 37){
    leftPressed = true;
  }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(paddleWidth < 120){
                      paddleWidth +=  20*(1/(score+1)) +30*(140/paddleWidth);
                      if(paddleWidth > 160){
                        paddleWidth = 160
                      }
                    }
                    if(bricksColor[0] > 0 && bricksColor[2] < 256 ){
                    bricksColor[0] -= 160;
                    bricksColor[2] += 160;
                    }
                    dy -= 1/(score+1);
                    dx -= 1/(score+1);
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#E3F2FD";
    ctx.fillText("Score: "+score, 8, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks()
    drawBall();
    drawPaddle();
    drawScore();

    collisionDetection();

    x += dx;
    y += dy;
    if(bricksColor[0]<256 && bricksColor[2]>0){
        bricksColor[0] += 2;
        bricksColor[2] -= 2 ;
    }

    if(y + dy < radius) {
       dy = -dy;
       paddleWidth += 20;
   }
   else if(y + dy > canvas.height-paddleHeight/2 -radius) {
       if(x > paddleX && x < paddleX + paddleWidth) {
           dy += 1/(score+1);
           dx += 1/(score+1);
           dy = -dy;

  }
  else if(y + dy  > canvas.height) {
           alert("GAME OVER");
           document.location.reload();
       }
   }

    if (x + dx > canvas.width - radius|| x + dx < radius) {
      dx = -dx;
      paddleWidth -= 10;
    }

    if(rightPressed) {
      if(paddleX + paddleSpeed > canvas.width - paddleWidth){
        paddleX += 0;
      }else {
        paddleX += paddleSpeed;
      }
    }
    else if(leftPressed) {
      if(paddleX - paddleSpeed < 0){
        paddleX += 0;
      }else {
        paddleX -= paddleSpeed;
      }
    }
    if(paddleWidth > 35){
      paddleWidth -= (0.1 + score/15);
    };
    requestAnimationFrame(draw);
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//setInterval(draw,10);
draw();
