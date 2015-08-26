(function () {
  var Game = window.Game = window.Game || {};

  var Coord = Game.Coord = function (x, y) {
    this.x = x;
    this.y = y;
  };

  Coord.prototype.plus = function (coords) {
    return new Coord(this.x + coords.x, this.y + coords.y);
  };

  Coord.prototype.equals = function (coords) {
    return (this.x == coords.x) && (this.y == coords.y);
  };

  Coord.prototype.isOpposite = function (coords) {
    return (this.x == coords.x * -1) && (this.y == coords.y * -1);
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

  Snake.SYMBOL = "S";

  Snake.prototype.head = function () {
    return this.segments[this.segments.length - 1];
  };

  Snake.prototype.move = function () {
    this.segments.push(this.head().plus(Snake.DIRS[this.dir]));
    this.segments.shift();

    if (!this.isValid()) {
      this.segments = [];
    }
  };

  Snake.prototype.turn = function (newDir) {
    if (Snake.DIRS[this.dir].isOpposite(Snake.DIRS[newDir])) {
      return;
    } else {
      this.dir = newDir;
    }
  };

  Snake.prototype.isValid = function () {
    var head = this.head()

    if (!this.board.validCoord(head)) {
      return false
    }

    for(var i = 0; i < this.segments.length - 1; i++) {
      if (this.segments[i] == head()) {
        return false;
      }
    }

    return true;
  };

  Snake.prototype.isOccupying = function (array) {
    var result = false;

    array.forEach(function (segment) {
      if (segment.x == array[0] && segment.y == array[1]) {
        result = true;
        return result;
      }
    })

    return result;
  };

  var Apple = Game.Apple = function (board) {
    this.board = board;
    this.replace();
  };

  Apple.SYMBOL = "A";

  Apple.prototype.replace = function () {
    var x = Math.floor(Math.random() * this.board.dim);
    var y = Math.floor(Math.random() * this.board.dim);

    while (this.board.snake.isOccupying([x, y])) {
      x = Math.floor(Math.random() * this.board.dim);
      y = Math.floor(Math.random() * this.board.dim);
    }

    this.position = new Coord(x, y);
  };

  var Board = Game.Board = function (dim) {
    this.dim = dim;
    this.snake = new Snake(this);
    this.apple = new Apple(this);
  };

  Board.BLANK_SYMBOL = ".";

  Board.blankGrid = function (dim) {
    var grid = [];

    for (var i = 0; i < dim; i++) {
      var row = [];
      for (var j = 0; j < dim; j++) {
        row.push(Board.BLANK_SYMBOL);
      }
      grid.push(row);
    }

    return grid;
  };

  Board.prototype.render = function () {
    var grid = Board.blankGrid(this.dim);

    this.snake.segments.forEach(function (segment) {
      grid[segment.x][segment.y] = Snake.SYMBOL;
    });

    grid[this.apple.position.x][this.apple.position.y] = Apple.SYMBOL;

    var rowStrs = [];
    grid.map(function (row) {
      return row.join("");
    }).join("\n");
  };

  Board.prototype.validCoord = function (coord) {
    return (coord.x < this.dim && coord.x >= 0) &&
    (coord.y < this.dim && coord.y >= 0)
  };

})();
