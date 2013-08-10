/**
 * Tile Puzzle
 * Main Tile Classes
 * Zach Hall, 2013
 */

// Constants:
var FLOOR = "floor";
var WALL = "wall";
var NORTH = "North";
var SOUTH = "South";
var EAST = "East";
var WEST = "West";

/*
Development notes
	In the final game engine, there will be two or more 2D arrays (layers).
	Anything that disappears or remains in the same position is in the background layer.
	Anything that MOVES such as a player, enemy, or movable tile, will be in foreground.
*/

function Tile () {
	this.name = "Tile";
		// The name of the function. Used in JSON conversions.
	this.image = FLOOR;
		// every tile will have an image class.
		// this isn't an image URL, rather a CSS class that will contain the urls.
		// which is good, as the skin isn't then tied to a permanant image URL.
	this.imageNorth = "";
	this.imageSouth = "";
	this.imageEast = "";
	this.imageWest = "";
		// the above images are directional image classes
	this.facing = undefined;
		// if the tile is facing a certain way, use one of these directional images.
		// else, display the default image
	this.animated = false;
		// if this image is an animated gif, a static image will exist
		// for each animated image in the /img/skin_name/static directory
		// this is used in the level editor
	this.walkable = true;
		// can this tile be walked upon? Default is true
	
	this.onCollisionWithPlayer = function (event) { return event; };
		// empty function. Basically, when the player collides with this tile,
		// what should we do?
	this.onCollisionWithEnemy = function (event) { return event;};
		// another empty function to explain what to do when an enemy lands on the tile.
	
	this.disappear = function (newImage, walkable) {
		// changes the image and sets the collision action to nothing
		if (!newImage) {
			this.image = FLOOR;
		}
		else {
			this.image = newImage;
		}
		if (walkable === undefined) {
			walkable = true;
		}
		
		this.onCollisionWithPlayer = function (event) {return event;};
		this.onCollisionWithEnemy = function (event) {return event;};
		this.walkable = walkable;
	};
}
Tile.prototype.toString = function () {
	if (!this.facing) {
		return this.image;
	}
	else {
		switch(this.facing) {
			case NORTH:
				return this.imageNorth;
				break;
			case SOUTH:
				return this.imageSouth;
				break;
			case EAST:
				return this.imageEast;
				break;
			case WEST:
				return this.imageWest;
				break;
			default:
				return this.image;
		}
	}
}
Tile.prototype.toJSON = function () {
	return JSON.stringify({name: this.name, facing: this.facing});
}

function ActionTile () {
	this.action = function (event) {};
		// action is a function that is performed on collision with player, usually
	
	this.onCollisionWithPlayer = function (event) {
		this.action(event);
		return event;
	};
}
ActionTile.prototype = new Tile;

function CollectTile (itemToCollect) {
	this.itemToCollect = itemToCollect;
		// object that is added to inventory, usually
	
	this.onCollisionWithPlayer = function (event) {
		collectItem(this.itemToCollect);
		this.disappear();
		return event;
	};
}
CollectTile.prototype = new Tile;

function ConditionTile () {
	this.condition = function (event) {return true;};
		// function that returns true or false depending on some condition.
		// the function takes an event argument
	this.actionIfTrue = function (event) {};
		// function that occurs if condition is true
	this.actionIfFalse = function (event) {};
		// function that occurs if condition is false
	
	this.onCollisionWithPlayer = function (event) {
		if (this.condition(event)) {
			this.actionIfTrue(event);
		}
		else {
			this.actionIfFalse(event);
		}
		return event;
	};
}
ConditionTile.prototype = new Tile;

function DeathTile (deathMessage) {
	if (deathMessage) {
		this.deathMessage = deathMessage;
	} else {
		this.deathMessage = "Ouch! You died.";
	}
	
	this.onCollisionWithPlayer = function (event) {
		event.blocked = {status: 2, message: this.deathMessage};
			// not sure how this will work yet. Perhaps something like this?
		return event;
	};
}
DeathTile.prototype = new Tile;

function DisappearTile (newImage) {
	this.newImage = newImage;
		// if there is a new image, set it on the first collision with the player
		// otherwise, don't use a new tile.
	
	this.onCollisionWithPlayer = function (event) {
		this.disappear(this.newImage);
		return event;
	};
}
DisappearTile.prototype = new Tile;

function FloorTile () {
	this.name = "FloorTile";
	this.image = FLOOR;
		// simple floor tile. Used as the default tile type.
}
FloorTile.prototype = new Tile;

function MovableTile () {
	// foreground tile
	
	this.walkable = false;
	
	this.onCollisionWithPlayer = function (event) {
		var px = event.tile.col, py = event.tile.row, x = event.x, y = event.y;
		var direction = event.direction;
		
		if (direction === LEFT) {
			// ...
		}
		
		return event;
	};
}
MovableTile.prototype = new Tile;

function SwitchTile (sw) {
	this.sw = sw;
		// the switch name
	
	this.onCollisionWithPlayer = function (event) {
		if (window.switches) {
			if (!window.switches[this.sw]) {
				window.switches[this.sw] = true;
			}
			else {
				window.switches[this.sw] = false;
			}
		}
		
		return event;
	};
}
SwitchTile.prototype = new Tile;

function WallTile () {
	// basic wall tile. Included in the base tile set for the same reason as the floor.
	this.name = "WallTile";
	this.walkable = false;
	this.image = WALL;
}
WallTile.prototype = new Tile;

function EnemyTile (deathMessage, movementPattern) {
	this.deathMessage = deathMessage;
	this.move = movementPattern;
		// move(event) will return coordinates on how the enemy will move
}
EnemyTile.prototype = new DeathTile;

function PlayerTile (id, skin) {
	// perhaps this will be used in some sort of online component
	
	this.image = skin.image;
	this.imageNorth = skin.north;
	this.imageSouth = skin.south;
	this.imageEast = skin.east;
	this.imageWest = skin.west;
		// skin support, these will all be URLs
	
	this.id = id.number;
	this.name = id.name;
		// identification of the player. Not useful unless online.
}
PlayerTile.prototype = new Tile;

function DefaultPlayerTile() {
	this.name = "DefaultPlayerTile";
}
DefaultPlayerTile.prototype = new PlayerTile(
	{
		number: 1,
		name: "Coffee"
	},
	{
		image: "player", imageNorth: "playerNorth",
		imageSouth: "playerSouth", imageEast: "playerEast",
		imageWest: "playerWest"
	}
);