//Global variables for grid and the sets
var cols = 50, rows= 50;
var openSet = [], closedSet = []; //open = to look into | closed = already looked in.
var start, end;
var w ,h ; //width and height
var path = [];

//Helper functions
//For this function we need to move backwards because as we search for the element 
//and we find it and remove it all the elements move back 1 and as you go on you can skip an element.
function removeFromArray (arr , elt) {
  for (var i = arr.length-1; i >= 0; i--) {
    if(arr[i] == elt){
      arr.splice(i, 1);
    }
  }
}


function heuristic(a,b){
  //dist is a P5 framework function
  var d = dist(a.i , a.j , b.i , b.j);
  return d;
}

//making the new grid
var grid = new Array(cols);
for(var i = 0; i< cols; i++){
  grid[i] = new Array(rows);
}

//Constructor for each object
function Spot(i,j){
  //Parameters for A star algorithem
  this.f = 0;
  this.g = 0;
  this.h = 0;
  //each spot to keep track of its neighbors
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  //randomly choose wall
  if(Math.random(1)<0.3){
    this.wall = true;
  }


  //coordinates
  this.i = i;
  this.j = j;

  //methods of Spot
  this.show = function(color) {
    fill(color);
    if(this.wall) fill(00); 
    noStroke();
    rect(this.i*w , this.j*h , w-1 , h-1);
  }

  this.addNeighbors = function (grid){
    var i = this.i, j=this.j;

    if(i<cols-1) this.neighbors.push(grid[i+1][j]);
    if(i>0)      this.neighbors.push(grid[i-1][j]);
    if(j<rows-1) this.neighbors.push(grid[i][j+1]);
    if(j>0)      this.neighbors.push(grid[i][j-1]);
    //This is diagonals
    if(i>0 && j>0) this.neighbors.push(grid[i-1][j-1]);
    if(i<cols-1 && j>0) this.neighbors.push(grid[i+1][j-1]);
    if(i>0 && j<rows-1) this.neighbors.push(grid[i-1][j+1]);
    if(i<cols-1 && j<rows-1) this.neighbors.push(grid[i+1][j+1]);
  }
}

//Stuff we want to put into each cell
for(var i = 0; i< cols; i++){
  for (let j = 0; j < rows; j++) {
    grid[i][j] = new Spot(i,j);
  }
}

//Adding the neighbors
for(var i = 0; i< cols; i++){
  for (let j = 0; j < rows; j++) {
    grid[i][j].addNeighbors(grid);
  }
}
//initializing the start and end
start = grid[0][0];
end = grid[cols-1][rows-1];

//making sure that the start and end are not walls.
start.wall = false;
end.wall = false;

//add the start point
openSet.push(start);


function setup (){
  frameRate(30);
  createCanvas (1400, 1400);
  w = width/cols;
  h = height/rows;
  
} 


function draw(){
  if (openSet.length>0){

    //Loop through everything and find the lowest f
    var winner = 0;
    for (var i = 0; i < openSet.length; i++) {
      if(openSet[i].f < openSet[winner].f){
        winner = i;
      }

      var current = openSet[winner];

      if(current === end){

        //Trying to make the path back to the start node
        //As long as there is a previous the put that into
        //The path array
        noLoop();
        console.log("done");
        return;
      }

      removeFromArray(openSet, current);
      closedSet.push(current);

      //for ease of use
      var neighbors = current.neighbors;
      
      //Looping through current's neigbors
      for (let i = 0; i < neighbors.length; i++) {
        //assign to a single neighbor, basically doing one by one
        var neighbor = neighbors[i];
        //A more efficent search could be done
        //
        if(!closedSet.includes(neighbor) && !neighbor.wall){
          //Each distance is 1, up down left right. since it is a grid.
          var tempG = current.g + 1;

          var newPath = false;
          if (openSet.includes(neighbor)){
            if(tempG < neighbor.g){
              neighbor.g = tempG;
              newPath = true;
            }
          }else{
            neighbor.g = tempG
            newPath = true;
            openSet.push(neighbor);
          }

          //calculating the heuristic
          if(newPath){
            neighbor.h = heuristic(neighbor,end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
          }

        }

      }

    }
  }else{
    console.log("no solution");
    noLoop();
    return;
  }
  background(0);

  //For debugging
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }


  //Looping through open and closed sets
  for (var i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(26,32,64));
  }

  for (var i = 0; i < openSet.length; i++) {
    openSet[i].show(color	(99,135,166));
  }

  //Analize the path
  path = [];
  var temp = current;
  path.push(temp);
  while(temp.previous){
    path.push(temp.previous);
    temp = temp.previous;
  }

  //Path shown in blue
  for(var i = 0; i<path.length; i++){
    path[i].show(color(242,214,179));        
  }
} 
