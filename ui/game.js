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
var maze;
var reloading = false;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Box {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.state = "close";
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

class Maze {
    constructor(dim) {
        this.dim = dim;
        this.set_maze();
        this.boxes = this.create_boxes();
        this.playerx = 1;
        this.playery = 1;
        this.state = "normal";
    }

    create_maze() {
        var percolates = false;
        var a, b;
        this.opened_ratio = 0;
        var opened_sites;
        this.maze = new Percolation(dim);
        this.maze.open(1,1);
        this.maze.open(dim, dim);
        while(percolates == false) {
            a = getRandomInt(2, dim-1);
            b = getRandomInt(1, dim);
            this.maze.open(a, b);
            opened_sites = this.maze.numberOfOpenSites();
            this.opened_ratio = opened_sites/(dim**2);
            percolates = this.maze.percolates();
        }
        // console.log(opened_sites);
        // console.log(this.opened_ratio); 
        this.opened_ratio = this.opened_ratio; 
    }

    set_maze() {
        var requirement = "hard";
        var mode;
        while(mode != requirement) {
            this.create_maze();
            // console.log(this.opened_ratio);
            if (this.opened_ratio > 0.8 || this.opened_ratio <=0.4) {
                mode = "reject";
            } else if (this.opened_ratio >= 0.65) {
                mode = "easy";
            } else if (this.opened_ratio>0.4 && this.opened_ratio<0.65) {
                mode = "hard";
                console.log(mode);
            }
        }
    }

    create_boxes() {
        var boxes = [];
        for(var i = 0;i<dim;i++) {
            for(var j = 0;j<dim;j++) {
                boxes.push(new Box(i, j));   
            }
        }
        return boxes;
    }

    draw() {
        var boxes = this.boxes;
        var maze_values = this.maze.value_grid;
        for(var i = 0;i<maze_values.length;i++) {
            if(this.state != "normal" && boxes[i].state == "player") {

            }
            else if(maze_values[i]==0) {
                boxes[i].close();
                boxes[i].state = "close";
            } else if(maze_values[i]==1) {
                boxes[i].open();
                boxes[i].state = "open";
            }  
        }
        
        boxes[this.maze.get_index(this.playerx, this.playery)].player();
        boxes[this.maze.get_index(this.playerx, this.playery)].state = "player";

        if(this.playerx==dim && this.playery==dim) {
            reloading = true;
            location.reload(true);
        }
      
    }
}

function solveMaze() {
    let queue = [];
    queue.push([1, 1]);
    
    let visited = new Set();
    let parent = new Map();
    visited.add("1,1");
    
    while (queue.length > 0) {
      let [x, y] = queue.shift();
      
      if (x === dim && y === dim) {
        break;
      }
      
      let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (let [dx, dy] of directions) {
        let nx = x + dx;
        let ny = y + dy;
        
        if (maze.maze.isOpen(nx, ny) && !visited.has(`${nx},${ny}`)) {
          queue.push([nx, ny]);
          visited.add(`${nx},${ny}`);
          parent.set(`${nx},${ny}`, [x, y]);
        }
      }
    }
    
    let path = [];
    let current = [dim, dim];
    while (current[0] !== 1 || current[1] !== 1) {
      path.push(current);
      current = parent.get(`${current[0]},${current[1]}`);
    }
    path.push([1, 1]);
    path.reverse();
    
    return path;
  }
  
  function animateSolution(path) {
    maze.state = "animation";
    let i = 0;
    let interval = setInterval(() => {
      if (i < path.length) {
        maze.playerx = path[i][0];
        maze.playery = path[i][1];
        i++;
      } else {
        clearInterval(interval);
      }
    }, 20); 
  }
  
  function setup() {
      var mycanvas = createCanvas(side*dim, side*dim);
      mycanvas.parent("gamecanvas");
      closed_c = color(0,0,0);
      opened_c = color('gray');
      player_c = color('blue');
      maze = new Maze(dim);

      
      // Create and add the solve button
      let solveButton = createButton('Solve Maze');
      solveButton.position(10, side*dim + 10);
      solveButton.mousePressed(() => {
        let solutionPath = solveMaze();
        animateSolution(solutionPath);
      });
  }


function keyPressed() {
    if (keyCode === UP_ARROW && maze.maze.isOpen(maze.playerx-1, maze.playery)) {
        maze.playerx--;
    } else if (keyCode === DOWN_ARROW && maze.maze.isOpen(maze.playerx+1, maze.playery)) {
        maze.playerx++;
    }  else if (keyCode === RIGHT_ARROW && maze.maze.isOpen(maze.playerx, maze.playery-1)) {
        maze.playery--;
    } else if (keyCode === LEFT_ARROW && maze.maze.isOpen(maze.playerx, maze.playery+1)) {
        maze.playery++;
    }
}

function draw() {
    if(!reloading) {
        background(220);
        stroke(color(0,0,0));
        strokeWeight(2);
        square(0,0,dim*side);
        noStroke();
        maze.draw();    
    }
}

