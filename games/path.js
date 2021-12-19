const canvasPath = document.getElementById("gameboard-path");
const startBtnPath = document.getElementById("start-btn-path");
const ctx = canvasPath.getContext("2d");

const ORIGIN = 0;
const TOP_LINE_HEIGHT = 20;
const TOP_LINE_WIDTH = 550;
const GAP = 50;

const BALL_RADIUS_PATH = GAP / 2.7;

ctx.lineWidth = 3;
ctx.lineJoin = "bevel";
ctx.strokeStyle = "white";

let isMoving = false;
let winPath = false;
let PathgameOver = false;
let mouseOffsetTop = null;
let mouseOffsetLeft = null;

const ballPath = {
  x: 25,
  y: 45,
  radius: BALL_RADIUS_PATH,
};

const checkCollisionPath = () => {
  if (ballPath.y - ballPath.radius <= TOP_LINE_HEIGHT + ctx.lineWidth / 2) {
    PathgameOver = true;
  }
  if (ballPath.x + ballPath.radius >= TOP_LINE_WIDTH - ctx.lineWidth / 2) {
    PathgameOver = true;
  }
  if (
    ballPath.y + ballPath.radius > TOP_LINE_HEIGHT + GAP &&
    ballPath.x - ballPath.radius < TOP_LINE_WIDTH - GAP &&
    ballPath.x + ballPath.radius < TOP_LINE_WIDTH
  ) {
    PathgameOver = true;
  }
};
//* SI la ballPathe la ballPathe est entre la ligne la plus a droite et la ligne de gauche => elle peut descendre
const drawBallPath = () => {
  ctx.moveTo(ballPath.x + ballPath.radius, ballPath.y);
  ctx.arc(ballPath.x, ballPath.y, ballPath.radius, 0, 2 * Math.PI);
};

const drawPath = () => {
  ctx.beginPath();
  ctx.moveTo(ORIGIN, TOP_LINE_HEIGHT);
  ctx.lineTo(TOP_LINE_WIDTH, TOP_LINE_HEIGHT);
  ctx.lineTo(TOP_LINE_WIDTH, canvasPath.height);
  ctx.moveTo(TOP_LINE_WIDTH - GAP, canvasPath.height);
  ctx.lineTo(TOP_LINE_WIDTH - GAP, TOP_LINE_HEIGHT + GAP);
  ctx.lineTo(ORIGIN, TOP_LINE_HEIGHT + GAP);
};

const drawVictoryPath = () => {
  ctx.fillStyle = "green";
  ctx.font = "25px sans-serif";
  ctx.fillText("VICTORY", 200, 200);
};
const drawLoosePath = () => {
  ctx.fillStyle = "green";
  ctx.font = "25px sans-serif";
  ctx.fillText("DEFEAT", 200, 200);
};

const drawPathApp = () => {
  ctx.clearRect(0, 0, canvasPath.width, canvasPath.height);
  drawPath();
  drawBallPath();
  ctx.stroke();
};

const playPath = () => {
  drawPathApp();
  checkCollisionPath();
};

canvasPath.addEventListener("mousedown", (event) => {
  if (
    ballPath.x - ballPath.radius < event.offsetX &&
    event.offsetX < ballPath.x + ballPath.radius &&
    ballPath.y - ballPath.radius < event.offsetY 
    && event.offsetY < ballPath.y + ballPath.radius
  ) {
    isMoving = true;
    mouseOffsetTop = ballPath.x - event.offsetX + event.target.offsetTop;
    mouseOffsetLeft = ballPath.y - event.offsetY + event.target.offsetWidth;
    ballPath.x = event.offsetX - event.target.offsetTop + mouseOffsetTop;
    ballPath.y = event.offsetY - event.target.offsetWidth + mouseOffsetLeft;
    if (!winPath && !PathgameOver) {
      playPath();
    }
  }
});

window.addEventListener("mouseup", (event) => {
  isMoving = false;

  if(PathgameOver){
    isMoving = false;
    winPath = false;
    PathgameOver = false;
    mouseOffsetTop = null;
    mouseOffsetLeft = null;
    ballPath.x = 25;
    ballPath.y = 45;
    drawPathApp();
  }
});

canvasPath.addEventListener("mousemove", (event) => {
  if (isMoving) {

    ballPath.x = event.offsetX - event.target.offsetTop + mouseOffsetTop;
    ballPath.y = event.offsetY - event.target.offsetWidth + mouseOffsetLeft;

    if (ballPath.y + ballPath.radius > canvasPath.height) {
      winPath = true;
    }
    if (PathgameOver) {
      drawLoosePath();
    }
    if (winPath) {
      drawVictoryPath();
      cube.classList.add( 'show-back' );
      cube.classList.remove('show-right')
    }
    if (!winPath && !PathgameOver) {
      playPath();
    }
  }
});

drawPathApp();

startBtnPath.addEventListener("click", (event) => {
  isMoving = false;
  winPath = false;
  PathgameOver = false;
  mouseOffsetTop = null;
  mouseOffsetLeft = null;
  ballPath.x = 25;
  ballPath.y = 45;
  drawPathApp();
});
