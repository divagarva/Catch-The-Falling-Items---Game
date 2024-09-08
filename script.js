const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

canvas.width = 400;
canvas.height = 600;

let basket = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 50,
    width: 80,
    height: 20,
    dx: 0
};

let items = [];
let score = 0;
let missedItems = 0;
let gameOver = false;

function createItem() {
    const x = Math.random() * (canvas.width - 30);
    items.push({ x, y: 0, width: 30, height: 30, speed: 2 });
}

function drawBasket() {
    ctx.fillStyle = 'brown';
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawItem(item) {
    ctx.fillStyle = 'green';
    ctx.fillRect(item.x, item.y, item.width, item.height);
}

function moveBasket() {
    basket.x += basket.dx;
    if (basket.x < 0) basket.x = 0;
    if (basket.x + basket.width > canvas.width) basket.x = canvas.width - basket.width;
}

function moveItems() {
    items.forEach(item => {
        item.y += item.speed;
    });
}

function detectCatch() {
    items = items.filter(item => {
        if (item.y + item.height > basket.y && item.x > basket.x && item.x < basket.x + basket.width) {
            score += 10;
            document.getElementById('score').textContent = `Score: ${score}`;
            return false;
        }
        return true;
    });
}

function detectMiss() {
    items = items.filter(item => {
        if (item.y >= canvas.height) {
            missedItems += 1;
            if (missedItems >= 10) {
                gameOver = true;
                endGame();
            }
            return false;
        }
        return true;
    });
}

function endGame() {
    // Display the Game Over screen
    canvas.style.display = 'none';
    gameOverScreen.style.display = 'block';
    finalScore.textContent = score;
}

function update() {
    if (gameOver) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBasket();
    items.forEach(drawItem);
    moveBasket();
    moveItems();
    detectCatch();
    detectMiss();
}

function loop() {
    update();
    if (!gameOver) {
        requestAnimationFrame(loop);
    }
}

// Restart game logic
function restartGame() {
    // Reset game variables
    basket.x = canvas.width / 2 - 40;
    items = [];
    score = 0;
    missedItems = 0;
    gameOver = false;

    // Reset score display
    document.getElementById('score').textContent = `Score: ${score}`;

    // Hide Game Over screen and show canvas
    gameOverScreen.style.display = 'none';
    canvas.style.display = 'block';

    // Restart game loop
    loop();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') basket.dx = -5;
    if (e.key === 'ArrowRight') basket.dx = 5;
});

document.addEventListener('keyup', () => {
    basket.dx = 0;
});

// Handle restart button click
restartButton.addEventListener('click', restartGame);

setInterval(createItem, 1000);
loop();
