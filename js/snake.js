(function () {
  var Game = window.Game = window.Game || {};

  var Coord = Game.Coord = function (x, y) {
    this.x = x;
    this.y = y;
  };

  Coord.prototype.plus = function (coords) {
    return (this.x + coord.x) && (this.y + coord.y);
  };

  Coord.prototype.equals = function (coords) {
    return (this.x == coord.x) && (this.y == coord.y);
  };

  Coord.prototype.isOpposite = function (coords) {
    return (this.x == coord.x * -1) && (this.y == coord.y * -1;
  };

  var Snake = Game.Snake = function (board) {
    this.dir = "N";
    this.board = board;

    var center = new Coord(Math.floor(board.dim/2), Math.floor(board.dim/2));
    this.segments = [center];
  };

  Snake.DIRS = {
    "N": new Coord(-1, 0),
    "E": new Coord(0, 1),
    "S": new Coord(1, 0),
    "W": new Coord(0, -1)
  };

  Snake.prototype.head = function () {
    return this.segments[this.segments.length - 1];
  };

  Snake.prototype.move = function () {
    this.segments.push(this.head.plus(Snake.DIRS[this.dir]);
    this.segments.shift();
  };

  Snake.prototype.turn = function (newDir) {
    if (Snake.DIRS[this.dir].isOpposite(Snake.DIRS[newDir])) {
      return;
    } else {
      this.dir = newDir;
    }
  };

  var Board = Game.Board = function (dim) {
    this.dim = dim;
    this.snake = new Snake(this);
  };

  Board.prototype.render = function () {
    var grid = [];

    for (var x = 0; x < this.dim; y++) {
      var row = []
      for (var y; y < this.dim; y++) {
        row.push(".");
      }
      grid.push(row);
    }

    this.snake.segments.forEach(function (segment) {
      grid[segment.x][segment.y] = 'S'
    });
  }


})
