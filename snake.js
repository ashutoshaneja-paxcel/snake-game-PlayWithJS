var canvas = document.getElementById('gameCanvas');

pen = canvas.getContext('2d');

//cellsize of each box in background
const cellSize = 32;

// Load Background and food
const background = new Image();
background.src = "Assets/Img/background.png";

const foodImg = new Image();
foodImg.src = "Assets/Img/food.png";

//Load Audio
let dead = new Audio();
let eat = new Audio();
let left = new Audio();
let right = new Audio();
let up = new Audio();
let down = new Audio();

dead.src = "Assets/Audio/dead.mp3";
eat.src = "Assets/Audio/eat.mp3";
left.src = "Assets/Audio/left.mp3";
right.src = "Assets/Audio/right.mp3";
up.src = "Assets/Audio/up.mp3";
down.src = "Assets/Audio/down.mp3";

// Creating snake using array
let snake = [];

// Initial snake size
snake[0] = {
    x: 9 * cellSize,
    y: 10 * cellSize
};

// Randomly plant food in the canvas, 17 Boxs are present in x-axis and 15 in y-axis
let food = {
    x: Math.floor(Math.random() * 17 + 1) * cellSize,
    y: Math.floor(Math.random() * 15 + 3) * cellSize
};

let score = 0;

// Handle keyboard controls
let direction;

function keyPressed(e) {
    console.log("User pressed", e.key);
    if (e.key == "ArrowRight" && direction != "left") {
        right.play();
        direction = "right";
    } else if (e.key == "ArrowLeft" && direction != "right") {
        left.play();
        direction = "left";
    } else if (e.key == "ArrowUp" && direction != "down") {
        up.play();
        direction = "up";
    } else if (e.key == "ArrowDown" && direction != "up") {
        down.play();
        direction = "down";
    }
}

document.addEventListener('keydown', keyPressed);

// Detect collision
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
        return false;
    }
}

// Draw objects on canvas
function draw() {

    pen.drawImage(background, 0, 0);

    for (let i = 0; i < snake.length; i++) {
        pen.fillStyle = (i == 0) ? "green" : "white";
        pen.fillRect(snake[i].x, snake[i].y, cellSize, cellSize);

        pen.strokeStyle = "red";
        pen.strokeRect(snake[i].x, snake[i].y, cellSize, cellSize);
    }

    pen.drawImage(foodImg, food.x, food.y);

    // Previous head
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "right") {
        snakeX += cellSize;
    } else if (direction == "left") {
        snakeX -= cellSize;
    } else if (direction == "up") {
        snakeY -= cellSize;
    } else if (direction == "down") {
        snakeY += cellSize;
    }

    // Detect when snake eats food, update score and randomly plant new food.
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        eat.play();
        food = {
            x: Math.floor(Math.random() * 17 + 1) * cellSize,
            y: Math.floor(Math.random() * 15 + 3) * cellSize
        };
    } else {
        // Remove tail
        snake.pop();
    }

    // New head of big snake
    let newHead = {
        x: snakeX,
        y: snakeY
    }

    // Game Over condition and notification
    if (snakeX < cellSize || snakeX > 17 * cellSize || snakeY < 3 * cellSize || snakeY > 17 * cellSize || collision(newHead, snake)) {
        clearInterval(game);
        dead.play();
        setTimeout(function() {
           alert("Gameover");
          }, 500);
    }

    // Write scorecard
    snake.unshift(newHead);
    pen.fillStyle = "white";
    pen.font = "45px Century Gothic";
    pen.fillText(score, 2 * cellSize, 1.6 * cellSize);
}

// Keep calling draw after every 100ms till the end of game
let game = setInterval(draw, 100);