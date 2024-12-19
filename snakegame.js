var gamewall = document.querySelector(".gamewall");
var button = {
    up: document.querySelector(".up"),
    left: document.querySelector(".left button"),
    right: document.querySelector(".right button"),
    down: document.querySelector(".down")
};

var snakeposition = 8; // Size of each snake segment
var snakeArray = [];
var direction = 'right'; // Default direction
var gameInterval; // To manage the continuous movement interval
var gameOver = false; // To track the game state
var food = {}; // Object to store the food's position and element

// Snake object for managing snake growth and food creation
var snake = {
    grow: function(className = "") {
        var snakebody = document.createElement("div");
        snakebody.classList.add("snake");
        if (className !== "") {
            snakebody.classList.add(className);
        }
        var snakeObject = {
            top: 0,
            left: 0,
            body: snakebody
        };

        snakeArray.push(snakeObject);
        gamewall.appendChild(snakebody);
    },
    createFood: function() {
        // Create a new food item
        var snakefood = document.createElement("div");
        snakefood.classList.add("apple");

        // Calculate the maximum possible position based on game wall size
        var maxTop = Math.floor(gamewall.offsetHeight / snakeposition) - 1; // Avoid placing food outside the game area vertically
        var maxLeft = Math.floor(gamewall.offsetWidth / snakeposition) - 1; // Avoid placing food outside the game area horizontally

        // Randomize the position of the food within the game wall (not at the edge)
        var foodTop = Math.floor(Math.random() * maxTop) * snakeposition;
        var foodLeft = Math.floor(Math.random() * maxLeft) * snakeposition;

        snakefood.style.top = `${foodTop}px`;
        snakefood.style.left = `${foodLeft}px`;

        food = { top: foodTop, left: foodLeft, body: snakefood };
        gamewall.appendChild(snakefood);
    },
    reset: function() {
        // Clear gameboard first to remove any residual snake or food
        gamewall.innerHTML = '';

        // Reset snakeArray
        snakeArray = [];

        // Reset game state and create snake from scratch
        this.grow("snake-head");
        this.grow();
        this.grow();
        this.grow();

        // Reset direction and game over state
        direction = 'right';
        gameOver = false;

        // Create the first piece of food
        this.createFood();
    }
};

// Initialize the snake and food
snake.grow("snake-head"); // Initially create the head
snake.grow(); // Create the first segment of the tail
snake.grow(); // Create the second segment of the tail
snake.grow(); // Create the third segment of the tail
snake.createFood(); // Create food on the game board

// Function to move the snake
function moveSnake() {
    if (gameOver) return;

    // Move the last segment to where the head currently is
    var head = snakeArray[0];
    var tail = snakeArray.pop(); // Remove the last segment to be the new head

    // Remove 'snake-head' class from current head and add to the new head
    head.body.classList.remove("snake-head");
    tail.body.classList.add("snake-head");

    // Update position of the new head based on the current direction
    if (direction === 'up') {
        tail.top = head.top - snakeposition;
        tail.left = head.left;
    } else if (direction === 'down') {
        tail.top = head.top + snakeposition;
        tail.left = head.left;
    } else if (direction === 'left') {
        tail.left = head.left - snakeposition;
        tail.top = head.top;
    } else if (direction === 'right') {
        tail.left = head.left + snakeposition;
        tail.top = head.top;
    }

    // Check for collision with walls
    if (tail.top < 0 || tail.left < 0 || 
        tail.top >= gamewall.offsetHeight || 
        tail.left >= gamewall.offsetWidth) {
        endGame(); // Call the function to end the game
        return;
    }

    // Check for collision with food
    if (tail.top === food.top && tail.left === food.left) {
        // Snake eats the food: remove food and create new food
        food.body.remove();
        snake.createFood();

        // Grow the snake
        snake.grow();
    }

    // Place the new head at the beginning of the array
    snakeArray.unshift(tail);

    // Update the position of all snake segments on the game board
    snakeArray.forEach(function(segment) {
        segment.body.style.top = `${segment.top}px`;
        segment.body.style.left = `${segment.left}px`;
    });
}

// Function to handle direction change and immediately move the snake
function changeDirection(newDirection) {
    if (gameOver) return;

    if (
        (direction === 'up' && newDirection === 'down') ||
        (direction === 'down' && newDirection === 'up') ||
        (direction === 'left' && newDirection === 'right') ||
        (direction === 'right' && newDirection === 'left')
    ) {
        return; // Prevent reversing direction
    }

    direction = newDirection;
    moveSnake(); // Immediately move the snake in the new direction
}

// Function to end the game
function endGame() {
    clearInterval(gameInterval); // Stop the movement
    gameOver = true; // Mark the game as over

    setTimeout(() => {
        if (confirm("Game Over! Do you want to restart?")) {
            restartGame(); // Restart the game if the user confirms
        }
    }, 100);
}

// Function to restart the game
function restartGame() {
    snake.reset(); // Reset the snake and game state
    clearInterval(gameInterval);
    gameInterval = setInterval(moveSnake, 100); // Restart the game loop
}

// Add event listeners for control buttons to change direction
button.left.addEventListener('click', function() {
    changeDirection('left');
});
button.right.addEventListener('click', function() {
    changeDirection('right');
});
button.up.addEventListener('click', function() {
    changeDirection('up');
});
button.down.addEventListener('click', function() {
    changeDirection('down');
});

// Start continuous movement when the game begins
gameInterval = setInterval(moveSnake, 100); // Adjust speed by changing the interval time
