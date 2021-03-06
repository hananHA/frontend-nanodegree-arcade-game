// By : Hanan Alahmadi

// Variables declarations
var ENEMIES = ['images/enemy-car-1.png', 'images/enemy-car-2.png', 'images/enemy-car-3.png'];

var GEMS = ['images/gem-green.png', 'images/gem-red.png', 'images/diamond-blue.png'];

// Initializing the player position
var playerStartPos = {
    x: 202,
    y: 332,
    startCol: 3, 
    startRow: 5
};

//Initializing the enemy position
var enemyStartPos = {
    x: 0,
};

var colWidth = 101;
var rowHeight = 83;

var enemyWidth = 101;
var playerWidth = 70;
var gemWidth = 50;

var starWidth = 45;
var heartWidth = 45;

var lost = false;

var collected = false;

// Enemies our player must avoid - Enemy class
var Enemy = function(sprite, startRow) {
    // Variables applied to each of our instances go here
    this.sprite = sprite;
    this.x = enemyStartPos.x;
    this.y = (startRow * rowHeight) - (rowHeight / 2);  
    this.startCol = 1;
    this.row = enemyStartPos.startRow;
    this.speed = randomInt(50, 200);
};

// Draw enemy on screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    // If the enemy reaches the right end, set its x value to the initial one
    if(this.x > colWidth * 5) {
        this.x = enemyStartPos.x;
        //this.speed += 100;
    }
};


// Player class
var Player = function(score, heart) {
    this.sprite = 'images/char-cat.png';
    this.x = playerStartPos.x;
    this.y = playerStartPos.y - (rowHeight / 2);
    this.col = playerStartPos.startCol;
    this.row = playerStartPos.startRow;
    this.score = score;
    this.heart = heart;
};

// Player render function
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.move = function(input) {

    if(input === 'up'){
        this.y -= rowHeight;
        this.row--;
    }else if(input === 'down'){
        this.y += rowHeight;
        this.row++;
    }else if(input === 'right'){
        this.x += colWidth;
        this.col++;
    }else if(input === 'left'){
        this.x -= colWidth;
        this.col--;
    }
}

// Player update function
Player.prototype.update = function() {

    // Update the player's x and y values unless the player lost the game
    if(!lost) {

        this.move(); 

        // Not letting the player go out of the canvas
        var downBorder = (rowHeight * 6) - (rowHeight / 2);
        var upBorder = 0 - rowHeight + (rowHeight / 2);
        var rightBorder = colWidth * 4;
        var leftBorder = 0;

        if(this.y >= downBorder) {
            this.y = downBorder - rowHeight;
        }
        if(this.y <= upBorder) {
            this.x = playerStartPos.x;
            this.y = playerStartPos.y - (rowHeight / 2);
            // Updating the score when reaching the top row
            this.score++;
        }
        if(this.x >= rightBorder){
            this.x = rightBorder;
        }
        if(this.x <= leftBorder){
            this.x = leftBorder;
        }

        this.collision();
    }
};

// Player collision detection function
Player.prototype.collision = function(){

    // Check if the player collides with an enemy
    for(var enemy = 0; enemy < allEnemies.length; enemy++) {
        if(this.y === allEnemies[enemy].y && this.x < allEnemies[enemy].x + (enemyWidth - (colWidth / 2)) && this.x + playerWidth > allEnemies[enemy].x) {
            var meow = new Audio('sounds/meow.mp3');
            meow.play();
            this.x = playerStartPos.x;
            this.y = playerStartPos.y - (rowHeight / 2);
            if(this.heart <= 0){
                gameOver();
                lost = true;
            }else {
                this.heart--;
                gameStart();
            }
        }
    }

    //Check if the player collides with a gem
    if(this.y === newGem.y && this.x < newGem.x + gemWidth && this.x + playerWidth > newGem.x) {
        collected = true;
        var gemCollected = new Audio('sounds/gem.mp3');
        gemCollected.play();
        if(collected) {
            switch(newGem.sprite) {
                case GEMS[0]:
                    this.score += 10;
                    newGem.update(randomInt(0, 4), randomInt(1, 3));
                    newGem.sprite = GEMS[1];
                break;
                case GEMS[1]:
                    this.score += 20;
                    newGem.update(randomInt(0, 4), randomInt(1, 3));
                    newGem.sprite = GEMS[2];
                break;
                case GEMS[2]:
                    this.score += 30;
                    this.heart++;
                    newGem.update(randomInt(0, 4), randomInt(1, 3));
                    newGem.sprite = GEMS[0];
                break;
            }
        }
        
    }
};

// Player handleInput function
Player.prototype.handleInput = function(input) {
    switch(input){
        case 'up':
            this.move('up');
            break;
        case 'down':
            this.move('down');
            break;
        case 'right':
            this.move('right');
            break;
        case 'left':
            this.move('left');
            break;
        }
};

// Additional: Gem class
var Gem = function(col, row) {
    this.sprite = GEMS[0];
    this.col = col;
    this.row = row;
    this.x = col * 101;
    this.y = (row * 83) - (rowHeight / 2);
};

// Gem render function
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Gem update function
Gem.prototype.update = function(col, row) {
    this.x = col * 101;
    this.y = (row * 83) - (rowHeight / 2);
};


// Helper functions

// To get a random integer number between two values
function randomInt(min, max){
    // Reference: https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Update score counter function
function updateScore() {
    ctx.fillText(player.score, starWidth + 10, 30);
}

// Update hearts counter function
function updateHeart() {
    ctx.fillText(player.heart, 460 - heartWidth, 30);
}

// To show the score, a message and a button to restart the game when the player lose
var gameOver = function() {
    allEnemies = [];
    bgMusic.pause();
    $('.overlay-screen').show();
    var over = new Audio('sounds/gameover.mp3');
    over.play();
    var HTMLGameOver = '<h1>Game Over</h1>';
    $('.overlay-screen').append(HTMLGameOver);
    var HTMLStarImg = '<img id="starImg" width="45" height="45" src="images/star.png">';
    if(player.score === 0) {
        var HTMLMessage = '<P id="message">oops! try again</p>';
        $('.overlay-screen').append(HTMLMessage);
    }else if(0 < player.score && player.score <= 100) {
        var HTMLMessage1 = '<P id="message">good job!</p>';
        $('.overlay-screen').append(HTMLMessage1 + HTMLStarImg);
    }else if(100 < player.score && player.score <= 200) {
        var HTMLMessage2 = '<P id="message">excellent!</p>';
        $('.overlay-screen').append(HTMLMessage2 + HTMLStarImg + HTMLStarImg);
    }else if(player.score > 200) {
        var HTMLMessage3 = '<P id="message">marvelous!</p>';
        $('.overlay-screen').append(HTMLMessage3 + HTMLStarImg + HTMLStarImg + HTMLStarImg);
    }
    var HTMLScore = '<p id="score">Your score is :   <span>'+player.score+'</span></p>';
    var HTMLRestartBtn = '<input id="restartBtn" class="start-button" type="button" value="Restart" />';
    $('.overlay-screen').append(HTMLScore + HTMLRestartBtn);
    $(".start-button").click(function(){
        lost = false;
        player.score = 0;
        player.heart = 3;
        $('.overlay-screen').empty();
        $('.overlay-screen').hide();
        bgMusic.play();
        gameStart();
    });

};

// For restarting the game
function gameStart(){
    allEnemies = [];
    for(var i = 0; i < ENEMIES.length; i++){
    allEnemies.push(new Enemy(ENEMIES[i], randomInt(1, 3)));
    }
    // 0 score, 3 hearts
    var player = new Player(0, 3);

    var newGem = new Gem(randomInt(0, 4), randomInt(1, 3));
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
for(var i = 0; i < ENEMIES.length; i++){
allEnemies.push(new Enemy(ENEMIES[i], randomInt(1, 3)));
}

// Place the player object in a variable called player
// 0 score, 3 hearts
var player = new Player(0, 3);

// Gem object
var newGem = new Gem(randomInt(0, 4), randomInt(1, 3));

var bgMusic = new Audio('sounds/bgsound.mp3');
bgMusic.play();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
