// A room consists of a few components
// For this test, we're going to have a 5x5 room
// Consisting of just wall and floor tiles

function TestRoom (Max) {
	this.foreground = []; // 2D array of foreground tiles (moving)
	this.background = []; // 2D array of background tiles
	
	for (var r = 0; r < Max; r++) {
		var row = [];
		var rowForeground = [];
		for (var c = 0; c < Max; c++) {
			if (r === 0 || r === Max-1 || c === 0 || c === Max-1 || Math.floor(Math.random()*3) === 1) {
				row.push(new WallTile());
			}
			else if (Math.floor(Math.random()*20) === 1) {
				row.push(new TStrawberry());
			}
			else if (Math.floor(Math.random()*50) === 1) {
				row.push(new TBomb());
			}
			else {
				row.push(new FloorTile());
			}
			rowForeground.push("");
		}
		this.background.push(row);
		this.foreground.push(rowForeground);
	}
	
	var center = Math.floor(Max / 2);
	
	this.foreground[center][center] = new DefaultPlayerTile();
}
TestRoom.prototype = new Room;

var room = new TestRoom(20);

$(document).keydown(function(e){
	if (e.keyCode === 37) {
		// going left
		room.move(1, LEFT);
	}
	else if (e.keyCode === 38) {
		// going up
		room.move(1, UP);
	}
	else if (e.keyCode === 39) {
		// going right
		room.move(1, RIGHT);
	}
	else if (e.keyCode === 40) {
		// going down
		room.move(1, DOWN);
	}
	if (e.keyCode >= 37 && e.keyCode <= 40) {
		$("#game").html(room.toViewport(1, 10, 10));
		if (window.deathMessage) {
			alert(window.deathMessage);
			delete window.deathMessage;
		}
		return false;
	}
});

//$("#game").html(room.toString());
$("#game").html(room.toViewport(1, 10, 10));