const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const restartButton = document.querySelector('.btn-restart');
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const highScoreElement = document.querySelector("#high-Score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const blockSize = 50;

// Game Variables
let score = 0;
let highScore = Number(localStorage.getItem("highScore")) || 0;
let time = "00-00";
let intervalId = null;
let timerIntervalId = null;

highScoreElement.innerText = highScore;

let cols = 0;
let rows = 0;

let food = { x: 5, y: 5 };
let blocks = [];
let snake = [];

let direction = "left";

function initBoard() {
  cols = Math.floor(board.clientWidth / blockSize);
  rows = Math.floor(board.clientHeight / blockSize);

  blocks = [];
  board.innerHTML = "";

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const block = document.createElement("div");
      block.classList.add("block");
      board.appendChild(block);
      blocks[`${r}-${c}`] = block;
    }
  }
}

function resetGame() {
  score = 0;
  time = "00-00";
  direction = "left";

  snake = [
    { x: 1, y: 7 },
    // { x: 1, y: 4 },
    // { x: 1, y: 5 }
  ];

  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols)
  };

  scoreElement.innerText = score;
  timeElement.innerText = time;
  highScoreElement.innerText = highScore;
}

function render() {
  blocks[`${food.x}-${food.y}`].classList.add("food");

  let head;

  if (direction === "left")
    head = { x: snake[0].x, y: snake[0].y - 1 };
  else if (direction === "right")
    head = { x: snake[0].x, y: snake[0].y + 1 };
  else if (direction === "up")
    head = { x: snake[0].x - 1, y: snake[0].y };
  else if (direction === "down")
    head = { x: snake[0].x + 1, y: snake[0].y };

  // Hit wall → game over
  if (
    head.x < 0 || head.x >= rows ||
    head.y < 0 || head.y >= cols
  ) {
    endGame();
    return;
  }

  // Food eaten
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");

    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols)
    };

    score += 10;
    scoreElement.innerText = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreElement.innerText = highScore;
    }
  } else {
    let tail = snake.pop();
    blocks[`${tail.x}-${tail.y}`].classList.remove("fill");
  }

  snake.unshift(head);

  snake.forEach(seg => {
    blocks[`${seg.x}-${seg.y}`].classList.add("fill");
  });
}

function endGame() {
  clearInterval(intervalId);
  clearInterval(timerIntervalId);

  modal.style.display = "flex";
  startGameModal.style.display = "none";
  gameOverModal.style.display = "flex";
}

function startGame() {
  modal.style.display = "none";
  gameOverModal.style.display = "none";
  startGameModal.style.display = "none";

  initBoard();
  resetGame();

  intervalId = setInterval(render, 200);

  timerIntervalId = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);
    sec++;
    if (sec === 60) { sec = 0; min++; }
    time = `${min}-${sec}`;
    timeElement.innerText = time;
  }, 1000);
}

// Controls
addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "down") direction = "up";
  if (e.key === "ArrowDown" && direction !== "up") direction = "down";
  if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
  if (e.key === "ArrowRight" && direction !== "left") direction = "right";
});

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
