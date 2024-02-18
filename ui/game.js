var winheight = (95/100)*($(window).height());
var winwidth = $(window).width();
var mindist;
if(winheight<winwidth) {
    mindist = winheight;
} else {
    mindist = winwidth;
}

var closed_c;
var opened_c;
var player_c;
var side = 15;
var dim = Math.floor(mindist/side);
function setup() {
  createCanvas(side*dim, side*dim);
  closed_c = color(0,0,0);
  opened_c = color(255,255,255);
  player_c = color('blue');
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function create_maze() {
    var percolates = false;
    var a;
    var b;
    opened_ratio = 0;
    // var tempmaze;
    maze = new Percolation(dim);
    maze.open(1,1);
    maze.open(dim,dim);

    while(percolates == false) {
        a = getRandomInt(2, dim-1);
        b = getRandomInt(1, dim);
        // tempmaze = new Percolation(dim);
        // tempmaze.id_grid = maze.id_grid;
        // tempmaze.value_grid = maze.value_grid;
        // tempmaze.sizes = maze.sizes;
        // console.log([a,b]);
        // tempmaze.open(a, b);
        // percolates = tempmaze.percolates();
        maze.open(a, b);
        opened_sites = maze.numberOfOpenSites();
        opened_ratio = opened_sites/(dim**2);
        percolates = maze.percolates();
        // }
    }
    console.log(opened_sites);
    console.log(opened_ratio); 
    return opened_ratio
}
var requirement = "hard";
var mode;
while(mode != requirement) {
    var opened_ratio = create_maze();
    if (opened_ratio > 0.8 && opened_ratio <=0.4) {
        mode = "reject";
    } else if (opened_ratio >= 0.65) {
        mode = "easy";
    } else if (opened_ratio>0.4 && opened_ratio<0.65) {
        mode = "hard";
    }
}
var closed_c;
var opened_c;
var player_c;
var side = 15;
function setup() {
    var mycanvas = createCanvas(side*dim, side*dim);
    mycanvas.parent("gamecanvas")
    closed_c = color(0,0,0);
    opened_c = color(255,255,255);
    player_c = color('blue');
}


class Box {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    display() {
        var y = this.x*side;
        var x = (dim-1-this.y)*side;
        square(x, y, side);
       // rect(30, 20, 55, 55);
    }
    close() {
        fill(closed_c);
        this.display();
    }
    open() {
        fill(opened_c);
        this.display();
    }
    player() {
        fill(player_c);
        this.display();
    }
}
var boxes = [];
for(var i = 0;i<dim;i++) {
  for(var j = 0;j<dim;j++) {
    boxes.push(new Box(i, j));   
  }
}
var playerx = 1;
var playery = 1;

function keyPressed() {
    if (keyCode === UP_ARROW && maze.isOpen(playerx-1, playery)) {
        playerx--;
    } else if (keyCode === DOWN_ARROW && maze.isOpen(playerx+1, playery)) {
        playerx++;
    }  else if (keyCode === RIGHT_ARROW && maze.isOpen(playerx, playery-1)) {
        playery--;
    } else if (keyCode === LEFT_ARROW && maze.isOpen(playerx, playery+1)) {
        playery++;
    } else {
    }
}
function draw() {
  background(220);
  stroke(color(0,0,0));
  strokeWeight(2);
  square(0,0,dim*side)
    noStroke();
  maze_values = maze.value_grid;
  for(var i = 0;i<maze_values.length;i++) {
    if(maze_values[i]==0) {
        boxes[i].close();
    } else if(maze_values[i]==1) {
        boxes[i].open();
    } else {
    }
  }
  boxes[maze.get_index(playerx, playery)].player();
//   boxes[0].player();
//   boxes[1].player();
//   boxes[(dim**2)-1].player();
  if(playerx==dim && playery==dim) {
    location.reload(true);
  }
}
