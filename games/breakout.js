const canvasBreakout = document.getElementById('gameboard-breakout');
const startBtnBreakout = document.getElementById('start-btn-breakout');
const context = canvasBreakout.getContext('2d');

// * Declaring constants for the paddle
const PADDLE_SIZE = {
  width: 100,
  height: 20,
};

//* declaring constants to create bricks
const brick = { 
  row: 3,
  column: 6,
  gap: 20,
  width: null,
  height: 20,
  margin: 40,
  fillColor: 'white',
  strokeColor: 'white',
};

brick.width = Math.round((canvasBreakout.width - ((brick.column + 1) * brick.gap)) / brick.column);

//* declaring constants needed for the ball
const BALL_RADIUS_BREAKOUT = 8;
const BALL_SPEED = 3;

//* declaring a table where all targets will be stored
const bricks = [];

//* initializing variables
let leftArrowPressed = false;
let rightArrowPressed = false;
let gameOver = false;
let score = 0;
let breakoutWin = false;

function drawRectangle(x, y) {
  context.fillStyle = brick.fillColor;
  context.fillRect(x, y, brick.width, brick.height);
}

function drawStroke(x, y) {
  context.strokeStyle = brick.strokeColor;
  context.strokeRect(x, y, brick.width, brick.height);
}

//* paddle object with all paddle properties
const paddle = {
  x: canvasBreakout.width / 2 - PADDLE_SIZE.width / 2,
  y: canvasBreakout.height - PADDLE_SIZE.height - 50,
  width: PADDLE_SIZE.width,
  height: PADDLE_SIZE.height,
  dx: 20*BALL_SPEED,
};

//* ball object with all ball  properties
const ball = {
  x: canvasBreakout.width / 2,
  y: paddle.y - BALL_RADIUS_BREAKOUT,
  radius: BALL_RADIUS_BREAKOUT,
  speed: BALL_SPEED,
  dx: BALL_SPEED,
  dy: -BALL_SPEED,
};

/**
 * * function drawing the ball
 * @param {*} _
 */
const drawBall = () => {
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

  context.fillStyle = 'white';
  context.fill();

  context.strokeStyle = 'black';
  context.stroke();

  context.closePath();
};

/**
 * * function drawing the paddle
 * @param {*} _
 */
const drawPaddle = () => {
  context.fillStyle = 'white';
  context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  context.strokeStyle = 'black';
  context.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
};

const drawBricks = () => {
  for (let row = 0; row < brick.row; row += 1) {
    for (let column = 0; column < brick.column; column += 1) {
      const currentBrick = bricks[`${row}${column}`];
      if (currentBrick.status) {
        drawRectangle(currentBrick.x, currentBrick.y);
        drawStroke(currentBrick.x, currentBrick.y);
      }
    }
  }
};

/**
 * * Metafunction to draw both paddle and ball
 * @param {*} _
 */
const draw = () => {
  drawBall();
  drawPaddle();
  drawBricks();
};

/**
 * * handling paddle movments
 * @param {*} _
 */
const movePaddle = () => {
  if (rightArrowPressed && (paddle.x + paddle.width) < canvasBreakout.width) {
    paddle.x += paddle.dx;
  } else if (leftArrowPressed && paddle.x >= 0) {
    paddle.x -= paddle.dx;
  }
};

/**
 * * handling ball movments
 * @param {*} _
 */
const moveBall = () => {
  ball.x += ball.dx;
  ball.y += ball.dy;
};

/**
 * * verifying if ball is in the canvasBreakout
 * @param {*} _
 */
const ballCollision = () => {
  if (ball.x + ball.radius >= canvasBreakout.width || ball.x - ball.radius <= 0) {
    ball.dx = -ball.dx;
  }
  if (ball.y - ball.radius <= 0) {
    ball.dy = -ball.dy;
  }

  if (ball.y + ball.radius >= canvasBreakout.height) {
    gameOver = true;
  }
};

/**
 * * make the ball bounce on the paddle (max angle 60° => Math.PI/3)
 * @param {*} _
 */
const paddleCollision = () => {
  if (ball.x < paddle.x + paddle.width && ball.x > paddle.x
    && paddle.y < paddle.y + paddle.height && ball.y > paddle.y) {
    let collidePoint = ball.x - (paddle.x + paddle.width / 2);

    collidePoint /= (paddle.width / 2);

    const angle = collidePoint * (Math.PI / 3);

    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
  }
};

const brickCollision = () => {
  for (let row = 0; row < brick.row; row += 1) {
    for (let column = 0; column < brick.column; column += 1) {
      const currentBrick = bricks[`${row}${column}`];
      if (currentBrick.status) {
        if (ball.x + ball.radius > currentBrick.x
            && ball.x - ball.radius < currentBrick.x + brick.width
            && ball.y + ball.radius > currentBrick.y
            && ball.y - ball.radius < currentBrick.y + brick.height) {
          currentBrick.status = false;
          ball.dy = -ball.dy;
          score += 1;
        }
      }
    }
  }
};

const showScore = () => {
  context.fillStyle = 'white';
  context.font = '25px sans-serif';
  context.fillText(score, 35, 25);
};

/**
 * * metafunction updating the status of the ball and the paddle
 * @param {*} _
 */
const update = () => {
    if (breakoutWin || score === (brick.row * brick.column)) {
        cube.classList.remove('show-back');
        cube.classList.add('show-bottom');
    }
  movePaddle();
  moveBall();
  ballCollision();
  paddleCollision();
  brickCollision();
  showScore();
};

/**
 * * function running to make the game move
 * @param {*} _
 */
const loop = () => {
  context.clearRect(0, 0, canvasBreakout.width, canvasBreakout.height);
  draw();
  update();
  if (score === (brick.row * brick.column)){
      breakoutWin = true;
      cube.classList.add('show-bottom');
      cube.classList.remove('show-back');
  }
  if (!gameOver && score < (brick.row * brick.column)) {
    requestAnimationFrame(loop);
  }
};

const createBricks = () => {
  for (let row = 0; row < brick.row; row += 1) {
    for (let column = 0; column < brick.column; column += 1) {
      bricks[`${row}${column}`] = {
        x: column * (brick.width + brick.gap) + brick.gap,
        y: row * (brick.height + brick.gap) + brick.gap + brick.margin,
        status: true,
      };
    }
  }
};

const resetBall = () => {
  ball.x = canvasBreakout.width / 2;
  ball.y = paddle.y - BALL_RADIUS_BREAKOUT;
  ball.speed = BALL_SPEED;
  ball.dx = BALL_SPEED;
  ball.dy = -BALL_SPEED;
};

const resetPaddle = () => {
  paddle.x = canvasBreakout.width / 2 - PADDLE_SIZE.width / 2;
  paddle.y = canvasBreakout.height - PADDLE_SIZE.height - 50;
  paddle.width = PADDLE_SIZE.width;
  paddle.height = PADDLE_SIZE.height;
  paddle.dx = 5;
};

const init = () => {
  createBricks();
  loop();
};

const reset = () => {
  resetBall();
  resetPaddle();
  init();
};

document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowLeft') {
    leftArrowPressed = true;
  } else if (event.code === 'ArrowRight') {
    rightArrowPressed = true;
  }
});
document.addEventListener('keyup', (event) => {
  if (event.code === 'ArrowLeft') {
    leftArrowPressed = false;
  } else if (event.code === 'ArrowRight') {
    rightArrowPressed = false;
  }
});

startBtnBreakout.addEventListener('click', (event) => {
  gameOver = false;
  score = 0;
  reset();
});

createBricks();
draw();