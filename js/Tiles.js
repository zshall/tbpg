/**
 * Tile Puzzle
 * Game Tiles
 * Zach Hall, 2013
 */

// Constants
var COLORS = {North: "Red", South: "Blue", East: "Green", West: "Yellow" };

function TFloor () {this.name = "TFloor";}
TFloor.prototype = new FloorTile;
TFloor.prototype.toJSON = function () { return "F"; };
function TWall () {this.name = "TWall";}
TWall.prototype = new WallTile;
TWall.prototype.toJSON = function () { return "W"; };
	// Floor and wall tile aliases

function TBomb () {
	this.name = "TBomb";
	this.image = "bomb";
	this.animated = true;
}
TBomb.prototype = new DeathTile("BOOM! Bombs got'cha.");

function TCloneButton (cloneMachine) {
	this.name = "TCloneButton";
	this.cloneMachine = cloneMachine;
	this.image = "cloneButton";
	
	this.action = function () {
		this.cloneMachine.clone();
	};
}
TCloneButton.prototype = new ActionTile;

function TStrawberry () {
	this.name = "TStrawberry";
	this.image = "strawberry";
}
TStrawberry.prototype = new CollectTile("strawberry");

function TDirt () {
	this.name = "TDirt";
	this.image = "dirt";
}
TDirt.prototype = new DisappearTile();

function TDoor (color) {
	this.name = "TDoor";
	this.color = COLORS[color];
		// the door's color
	this.image = undefined;
	this.imageNorth = "doorRed";
	this.imageSouth = "doorBlue";
	this.imageEast = "doorGreen";
	this.imageWest = "doorYellow";
	
	this.facing = color;
	
	this.walkable = false;
	
	this.condition = function (event) {
		return hasItem("key" + color);
	};
	
	this.conditionTrue = function (event) {
		this.disappear();
		this.walkable = true;
	};
	
	this.conditionFalse = function (event) {
		this.walkable = false;
	};
}
TDoor.prototype = new ConditionTile;

function TKey (color) {
	this.name = "TKey";
	this.color = COLORS[color];
	CollectTile.apply("key"+this.color);
		// key's color
	this.image = undefined;
	this.imageNorth = "keyRed";
	this.imageSouth = "keyBlue";
	this.imageEast = "keyGreen";
	this.imageWest = "keyYellow";
	
	this.facing = color;
}
TKey.prototype = new CollectTile;

function TDoorToggle () {
	this.name = "TDoorToggle";
	this.image = "doorToggle";
}
TDoorToggle.prototype = new SwitchTile("doorToggle");

function TExit () {
	this.name = "TExit";
	this.image = "exit";
	this.animated = true;
	
	this.action = function (event) {
		event.exit();
	};
}
TExit.prototype = new ActionTile;

function TForceFloor (facing) {
	this.name = "TForceFloor";
	this.image = "forceRandom";
	this.imageNorth = "forceNorth";
	this.imageSouth = "forceSouth";
	this.imageEast = "forceEast";
	this.imageWest = "forceWest";
	this.facing = facing;
	this.animated = true;
	
	this.action = function (event) {
		// ??? move
	}
}
TForceFloor.prototype = new ActionTile;

function TIce () {
	this.name = "TIce";
	this.image = "ice";
}