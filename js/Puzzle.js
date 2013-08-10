/**
 * Tile Puzzle
 * Zach Hall, 2013
 */

// Constants
var LEFT = {row: 0, col: -1};
var RIGHT = {row: 0, col: 1};
var UP = {row: -1, col: 0};
var DOWN = {row: 1, col: 0};
	// These are [row, col] pairs

function Room (background, foreground) {
	this.foreground = [];
	this.background = [];
	
	this.title = "";
	this.password = "";
	this.hint = "";
	this.required = "";
	this.time = "";
	
	if (background) this.background = background;
	if (foreground) this.foreground = foreground;
	
	this.blocked = function (tile, direction) {
		var nextTileBG = this.background[tile.row+direction.row][tile.col+direction.col];
		var nextTileFG = this.foreground[tile.row+direction.row][tile.col+direction.col];
		
		if (!nextTileBG) {
			return true;
				// we've reached an edge of the map. We're blocked.
		}
		else {
			if (nextTileFG) {
				if (nextTileFG.walkable && nextTileBG.walkable) {
					return false;
						// if both fg and bg are walkable we can go there
				}
			}
			else {
				if (nextTileBG.walkable) {
					return false;
						// if bg is walkable, we can go there
				}
			}
		}
		
		return true;
	};
	
	this.move = function (tileID, direction) {
		var tile = "";
		$.each (this.foreground, function (i1, row) {
			// find the tile with the ID number specified
			$.each (row, function (i2, col) {
				if (col instanceof PlayerTile) {
					if (col.id === tileID) {
						tile = {row: i1, col: i2};
					}
				}
			});
		});
		
		if (!this.blocked(tile, direction)) {
			var event = {};
			event.blocked = {status: 0, message: ""};
			event.room = this;
			event.tile = tile;
			event.direction = direction;
			
			var nr = tile.row+direction.row, nc = tile.col+direction.col;
			
			event.nextTileBG = this.background[nr][nc];
			event.nextTileFG = this.foreground[nr][nc];
			event.currentTile = this.foreground[tile.row][tile.col];
			
			if (event.currentTile instanceof PlayerTile) {
				event.player = event.currentTile;
				if (event.nextTileFG instanceof Tile) {
					event = event.nextTileFG.onCollisionWithPlayer(event);
				}
				if (event.nextTileBG instanceof Tile) {
					event = event.nextTileBG.onCollisionWithPlayer(event);
				}
			}
			else if (event.currentTile instanceof EnemyTile) {
				// enemy collisions
			}
			
			switch(event.blocked.status) {
				case 0:
					// not blocked, may move
					this.foreground[nr][nc] = this.foreground[tile.row][tile.col];
					this.foreground[tile.row][tile.col] = "";
					break;
				case 1:
					// blocked, not dead
					break;
				case 2:
					// dead
					this.foreground[nr][nc] = this.foreground[tile.row][tile.col];
					this.foreground[tile.row][tile.col] = "";
					window.deathMessage = event.blocked.message;
					break;
			}
		}
	};
	
	this.getTile = function (tileID) {
		// returns row and column of first tile with this ID
		var tile = null;
		$.each (this.foreground, function (i1, row) {
			// find the tile with the ID number specified
			$.each (row, function (i2, col) {
				if (col instanceof PlayerTile) {
					if (col.id === tileID) {
						tile = {row: i1, col: i2};
					}
				}
			});
		});
		return tile;
	};
	
	this.toViewport = function (focusID, width, height) {
		// focusID is the ID of the tile we want in the center, or at least in the frame
		var tile = this.getTile(focusID);
		var fr = tile.row, fc = tile.col;
		var distanceLR = Math.floor(width / 2);
		var distanceTD = Math.floor(height / 2);
		
		var maxDistanceLeft = null, maxDistanceRight = null;
		var maxDistanceUp = null, maxDistanceDown = null;
		
		// make these into one function
		for (var c = 0; c < distanceLR; c++) {
			if (!this.background[0][fc-c]) {
				if (maxDistanceLeft === null) {
					maxDistanceLeft = fc-c+1;
				}
			}
		}
		
		for (var r = 0; r < distanceTD; r++) {
			if (!this.background[fr-r]) {
				if (maxDistanceUp === null) {
					maxDistanceUp = fr-r+1;
				}
			}
		}
		
		if (fc - distanceLR < 0) {
			maxDistanceLeft = fc;
			distanceLR = width - fc;
			if (width % 2 === 1) distanceLR -= 1;
		}
		
		if (fr - distanceTD < 0) {
			maxDistanceUp = fr;
			distanceTD = height - fr;
			if (height % 2 === 1) distanceTD -= 1;
				// if we don't do this, one block is added or missing
		}
		
		if (maxDistanceLeft === null) maxDistanceLeft = distanceLR;
		if (maxDistanceUp === null) maxDistanceUp = distanceTD;
		
		var lc = this.background[0].length;
		if (fc + distanceLR > lc) {
			var difference = fc + distanceLR - lc;
			maxDistanceLeft += difference;
		}
		
		var lr = this.background.length;
		if (fr + distanceTD > lr) {
			var difference = fr + distanceTD - lr;
			maxDistanceUp += difference;
		}
		
		var newMapBG = [];
		var newMapFG = [];
		
		var rowsBG = this.background.slice(fr-maxDistanceUp, fr+distanceTD);
		var rowsFG = this.foreground.slice(fr-maxDistanceUp, fr+distanceTD);
			// row slicing first
		
		$.each(rowsBG, function (i, rowBG) {
			var rowFG = rowsFG[i];
			
			newMapBG.push(rowBG.slice(fc-maxDistanceLeft, fc+distanceLR));
			newMapFG.push(rowFG.slice(fc-maxDistanceLeft, fc+distanceLR));
		});
		
		return new Room(newMapBG, newMapFG).toString();
	};
}
Room.prototype.toString = function () {
	var map = "<table>";
	var background1 = this.background;
	var foreground1 = this.foreground;
	$.each(background1, function (i1, row) {
		map += "<tr>";
		$.each(row, function(i2, col) {
			var bg = col.toString();
			var fg = foreground1[i1][i2].toString();
			
			if (col.walkable && !(col instanceof FloorTile)) {
				bg += " " + FLOOR;
			}
			
			map += "<td><div class='tile bg "+bg+"' data-r='"+i1+"' data-c='"+i2+"'>";
			map += "<div class='fg "+fg+"'></div>";
			map += "</div></td>";
		});
		map += "</tr>";
	});
	
	map += "</table>";

	return map;
};
Room.prototype.toJSON = function() {
	var fg = [], bg = [];
	var background1 = this.background;
	$.each(this.foreground, function (i1, row) {
		var rF = [], rB = [];
		$.each(row, function (i2, col) {
			rF.push(col.toJSON());
			rB.push(background1[i1][i2].toJSON());
		});
		fg.push(rF);
		bg.push(rB);
	});
	return JSON.stringify({
		title: this.title,
		password: this.password,
		hint: this.hint,
		required: this.required,
		time: this.time,
		foreground: fg,
		background: bg
	});
};