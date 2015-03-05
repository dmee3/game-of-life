var WIDTH = 80;
var HEIGHT = 60;
var RES = 10;
var TIME;


var GOLWorld = function () {

	if (GOLWorld._instance) {
		return GOLWorld._instance;
	}
	
	GOLWorld._instance = this;
	
	this.grid = [];
	for (var i = 0; i < HEIGHT; i++) {
		this.grid[i] = [];
	}

	this.next = [];
	for (i = 0; i < HEIGHT; i++) {
		this.next[i] = [];
	}
	
	this.running = false;
};

GOLWorld.destroy = function () {
	_instance = null;
}

GOLWorld.prototype.init = function (density) {

	for (var i = 0; i < HEIGHT; i++) {
		for (var j = 0; j < WIDTH; j++) {
			if (Math.random() < density) this.grid[i][j] = 2;
			else this.grid[i][j] = 0;
		}
	}
};

GOLWorld.prototype.getCellNeighbors = function (i, j) {

	var cell = this.grid[i][j];
	var u = i - 1;
	var d = i + 1;
	var l = j - 1;
	var r = j + 1;
	
	if (i == 0) u = HEIGHT - 1;
	if (i == HEIGHT - 1) d = 0;
	if (j == 0) l = WIDTH - 1;
	if (j == WIDTH - 1) r = 0;
	
	var sum = 0;
	
	if (this.grid[u][l] == 2) sum++;
	if (this.grid[u][j] == 2) sum++;
	if (this.grid[u][r] == 2) sum++;
	if (this.grid[i][l] == 2) sum++;
	if (this.grid[i][r] == 2) sum++;
	if (this.grid[d][l] == 2) sum++;
	if (this.grid[d][j] == 2) sum++;
	if (this.grid[d][r] == 2) sum++;
	
	return sum;
}

GOLWorld.prototype.tick = function() {

	for (var i = 0; i < HEIGHT; i++) {
		for (var j = 0; j < WIDTH; j++) {
			var neighbors = this.getCellNeighbors(i, j);
			if (this.grid[i][j] == 2 && (neighbors < 2 || neighbors > 3)) this.next[i][j] = 1;
			else if (this.grid[i][j] < 2 && neighbors == 3) this.next[i][j] = 2;
			else this.next[i][j] = this.grid[i][j];
		}
	}
	
	for (i = 0; i < HEIGHT; i++) {
		this.grid[i] = this.next[i].slice();
	}
}

GOLWorld.prototype.draw = function (canvas) {

	var ctx = canvas.getContext('2d');
	ctx.lineWidth = 0.2;
	ctx.strokeStyle = '#999';
	ctx.beginPath();
	for (var i = 0; i < HEIGHT; i++) {
		for (var j = 0; j < WIDTH; j++) {
			if (this.grid[i][j] == 2) {
				ctx.fillStyle = '#0c0';
				ctx.fillRect(j*RES,i*RES,RES,RES);
			}
			else if (this.grid[i][j] == 1) {
				ctx.fillStyle = '#aea';
				ctx.fillRect(j*RES,i*RES,RES,RES);
			} else {
				ctx.clearRect(j*RES,i*RES,RES,RES);
			}
			ctx.strokeRect(j*RES,i*RES,RES,RES);
		}
	}
	
	ctx.stroke();
};


function canvasInit () {

	//Set up canvas
	var canv = document.getElementById('c');
	var ctx = canv.getContext('2d');
	ctx.lineWidth = 0.2;
	ctx.strokeStyle = '#999';
	
	//Clear current canvas
	ctx.beginPath();
	ctx.clearRect(0,0,canv.width,canv.height);
	ctx.stroke();
	
	//Draw new grid
	ctx.beginPath();
	for (var i = 0; i < RES*WIDTH; i += RES) {
		for (var j = 0; j < RES*HEIGHT; j += RES) {
			ctx.strokeRect(i,j,RES,RES);
		}
	}
	ctx.stroke();
}

function create () {

	var world = new GOLWorld();
	world.init(0.13);
	var canv = document.getElementById('c');
	world.draw(canv);
}

function start () {
	
	var world = new GOLWorld();

	if (!world.running) {
			
		var canv = document.getElementById('c');
		world.running = true;
	
		//Tick and display new world
		TIME = setInterval(function() {
			world.tick();
			world.draw(canv);
		}, 50);
	}
}

function stop () {

	var world = new GOLWorld();
	if (world.running) {
		clearInterval(TIME);
		world.running = false;
	}
}

function reset () {
	clearInterval(TIME);
	GOLWorld.destroy();
	canvasInit();
}