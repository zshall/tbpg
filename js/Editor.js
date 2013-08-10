/**
 * Tile Puzzle
 * Level Editor
 * Zach Hall, 2013
 */

// Constants
var SUPPORTED_TILES = ["TFloor", "TWall", "TBomb", "TStrawberry", "DefaultPlayerTile", "TExit", "TForceFloor", "TDirt", "TDoor", "TKey"];

// Window variables
var selectedTile = null;

// Modifications to default tile class for editing
function tileDiv (image, functionName, facing) {
	var title = image.replace("Static", "");
	if (image && title) {
		return "<div class='tile "+image+"' title='"+title+"' data-fname='"+functionName+"' data-facing='"+facing+"'></div>";
	}
	else {
		return "";
	}
}

Tile.prototype.toImage = function (name, showFacing) {
	// returns divs for tile images, as well as multidirectional ones if need be
	var s = this.animated ? "Static" : "";

	var facing;
	if (!this.facing) facing = "";
	else facing = this.facing;
	
	var image = this.toString() != undefined;
	var out = "";
	
	if (image) {
		var out = tileDiv(this.toString() + s, name, facing);
	}
	
	if (!showFacing) {
		if (!(this instanceof PlayerTile)) {
			out += tileDiv(this.imageNorth + s, name, NORTH);
			out += tileDiv(this.imageEast + s, name, EAST);
			out += tileDiv(this.imageSouth + s, name, SOUTH);
			out += tileDiv(this.imageWest + s, name, WEST);
		}
	}
	else {
		switch(showFacing) {
			case NORTH:
				out = tileDiv(this.imageNorth, name, NORTH);
				break;
			case SOUTH:
				out = tileDiv(this.imageSouth, name, SOUTH);
				break;
			case EAST:
				out = tileDiv(this.imageEast, name, EAST);
				break;
			case WEST:
				out = tileDiv(this.imageWest, name, WEST);
				break;
			default:
				if (image) {
					out = tileDiv(this.image, name, undefined);
				}
		}
	}
	
	return out;
}

// Room functions
function emptyRoom() {
	var background = [];
	var foreground = new generateEmptyGrid(32, 32, "");
	for (var r = 0; r < 32; r++) {
		var row = [];
		for (var c = 0; c < 32; c++) {
			row.push(new TFloor());
		}
		background.push(row);
	}
	foreground[0][0] = new DefaultPlayerTile();
	background[0][1] = new TExit();
	return new Room(background, foreground);
}

function init () {
	var tileHtml = "";
	$.each(SUPPORTED_TILES, function(i, tile) {
		tileHtml += new window[tile]().toImage(tile);
	});
	$("#tiles").html(tileHtml);
		// puts tile images in the tiles panel
	
	window.room = emptyRoom();
	$("#level").html(window.room.toString());
		// set up an empty level
	
	$("#tiles .tile").on("click", function (event) {
		var facing = $(this).attr("data-facing") === "" ? "not" : $(this).attr("data-facing");
		selectedTile = {name: $(this).attr("data-fname"), facing: facing};
		var html = "<div>"+new window[selectedTile.name]().toImage(undefined, facing)+"</div><div>Selected tile: " + selectedTile.name + "</div>";
		if (facing && facing != "not") html += "<div>Facing: "+facing+"</div>";
		$("#selectedTile").html(html);
	});
}

$(document).ready(function(){

	var isDown = false;
		// Tracks status of mouse button
	
	$(document).mousedown(function() {
		isDown = true;
			// When mouse goes down, set isDown to true
	})
	.mouseup(function() {
		isDown = false;
			// When mouse goes up, set isDown to false
	});

	$(document).delegate("#level .tile", "mousemove", function(){
		if(isDown && selectedTile) {
			// Only change css if mouse is down
			var r = $(this).attr("data-r"), c = $(this).attr("data-c");
			var tile = new window[selectedTile.name](selectedTile.facing);
			window.room.background[r][c] = tile;
			var html = "<div class='tile bg "+tile.toString()+"' data-r='"+r+"' data-c='"+c+"'>";
			html += "<div class='fg "+window.room.foreground[r][c]+"'></div>";
			html += "</div>";
			$("[data-r="+r+"][data-c="+c+"]").html(html);
		}
		return false;
	});
	
	$(document).delegate("#level .tile", "mousedown", function(){
		if(selectedTile) {
			// Only change css if mouse is down
			var r = $(this).attr("data-r"), c = $(this).attr("data-c");
			var tile = new window[selectedTile.name](selectedTile.facing);
			window.room.background[r][c] = tile;
			var html = "<div class='tile bg "+tile.toString()+"' data-r='"+r+"' data-c='"+c+"'>";
			html += "<div class='fg "+window.room.foreground[r][c]+"'></div>";
			html += "</div>";
			$("[data-r="+r+"][data-c="+c+"]").html(html);
		}
	});
	
	init();
});