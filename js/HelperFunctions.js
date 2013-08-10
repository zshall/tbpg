/**
 * Tile Puzzle
 * Helper Functions
 * Zach Hall, 2013
 */

// Item functions
window.collection = {};

function hasItem(itemName) {
	if (window.collection) {
		if (window.collection[itemName] > 0) {
			return window.collection[itemName];
		}
	}
	return 0;
}

function collectItem(itemName) {
	// for now, this will add to a dictionary of items
	if (window.collection) {
		if (window.collection[itemName]) {
			window.collection[itemName]++;
		}
		else {
			window.collection[itemName] = 1;
		}
	}
}

function loseItem(itemName) {
	if (hasItem(itemName)) {
		window.collection[itemName]--;
		return true;
	}
	return false;
}

String.prototype.onCollisionWithPlayer = function(event) { return event; };
String.prototype.onCollisionWithEnemy = function(event) { return event; };
String.prototype.toJSON = function() { return ""; };

function generateEmptyGrid(width, height, defaultValue) {
	// makes a 2D array of dimensions (width, height) with defaultValue as the value
	var grid = [];
	
	for (var r = 0; r < height; r++) {
		var row = [];
		for (var c = 0; c < width; c++) {
			row.push(defaultValue);
		}
		grid.push(row);
	}
	
	return grid;
}

/**
 * 3rd party helper functions
 */

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};