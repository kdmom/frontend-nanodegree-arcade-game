//Global Variables
var NumRows = 6;
var NumCols = 5;
var blockWidth = 101;
var blockHeight = 83;
var maxBugs = 10;

//Random number generated found at
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

// Enemies our player must avoid
var Enemy = function() {
	// Variables applied to each of our instances

	this.x = 0;
	this.y = blockHeight * getRandomInt(1,4);

	this.curCol = 0;
	this.curRow = this.y/blockHeight;

	this.speed = getRandomInt(20, 50);
	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
	this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	this.x += this.speed * dt;
	this.curCol = Math.round(this.x/blockWidth);
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {

	this.startRow = NumRows - 1;
	this.startCol = NumCols - 3;
	this.startX = blockWidth * this.startCol;
	this.startY = blockHeight * this.startRow;

	//Player starting position
	this.x = this.startX;
	this.y = this.startY;
	this.curRow = this.startRow;
	this.curCol = this.startCol;

	this.sprite = 'images/char-pink-girl.png';
}

//When player is updated, check for collisions and reset any bugs that have already crossed the
//entire screen
Player.prototype.update = function(dt) {
	allEnemies.forEach(resetOffScreenBugs);
	allEnemies.forEach(checkCollision);
}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//Process the arrow keys
Player.prototype.handleInput = function(key){

	if (key == 'left' && this.curCol > 0)
	{
		this.x -=  blockWidth;
		this.curCol -= 1;
	}
	else if (key == 'right' && this.curCol < NumCols - 1)
	{
		this.x += blockWidth;
		this.curCol += 1;
	}
	else if (key == "up" && this.curRow > 0)
	{
		this.y -= blockHeight;
		this.curRow -= 1;
	}
	else if (key == "down" && this.curRow < NumRows - 1)
	{
		this.y = this.y + blockHeight;
		this.curRow += 1;
	}
	else
	{
		return false;
	};

	//See if player has reached the water, if so reset player back to starting location
	if (this.curRow == 0)
	{
		player.reset();
	}
}

//reset player back to starting location
Player.prototype.reset = function()
{
	this.x = this.startX;
	this.y = this.startY;

	this.curRow = this.startRow;
	this.curCol = this.startCol;
}

//When a bug goes off the screen, reset the col so that it can move across the screen again.
function resetOffScreenBugs(bug, index, array)
{
	if (bug.curCol > NumCols + 1)
	{
		bug.x = 0;
		bug.curCol = 0;
	}
}

//Check if bug and player occupy the same space, if so then a collision occured and player is reset
function checkCollision(bug, index, array)
{
	if(player.curRow === bug.curRow && player.curCol === bug.curCol)
	{
		player.reset();
	}
}

//put a new bug on the array up to maxBugs.
var createEnemy = function()
{
	if (allEnemies.length < maxBugs)
	{
		allEnemies.push(new Enemy());
	}
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];

//Initialize player
var player = new Player();

//create new enemies at random time between 1 and 5 seconds
var newEnemyCreated = setInterval(createEnemy, getRandomInt(1000,5000));

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
