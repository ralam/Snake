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

    this.turning = false;

    var center = new Coord(Math.floor(board.dim/2), Math.floor(board.dim/2));
    this.segments = [center];

    this.growthTurns = 0;
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
    this.turning = false;

    if (!this.isValid()) {
      this.segments = [];
    }

    if (this.eatApple()) {
      this.board.removeApple();
      if (this.board.apples.length === 0) {
        var n = Math.floor(Math.random() * 2) + 1;

        for (n; n > 0; n--) {
          this.board.apple.replace();
          this.board.apples.push(this.board.apple.position)
        }
      }
    }

    if (this.growthTurns > 0) {
      this.growthTurns -= 1;
    } else {
      this.segments.shift();
    }

  };



  Snake.prototype.eatApple = function () {
    var eaten = false

    this.board.apples.forEach(function (position) {
      if (this.head().equals(position)) {
        this.growthTurns += 3;
        this.board.points += 10;
        eaten = true;
        return eaten;
      }
    }.bind(this));


    return eaten;
  };

  Snake.prototype.turn = function (newDir) {
    if (Snake.DIRS[this.dir].isOpposite(Snake.DIRS[newDir]) || this.turning) {
      return;
    } else {
      this.dir = newDir;
      this.turning = true;
    }
  };

  Snake.prototype.isValid = function () {
    var head = this.head()

    if (!this.board.validCoord(head)) {
      return false
    }

    for(var i = 0; i < this.segments.length - 1; i++) {
      if (this.segments[i].equals(head)) {
        return false;
      }
    }

    return true;
  };

  Snake.prototype.isOccupying = function (array) {
    var result = false;

    this.segments.forEach(function (segment) {
      if (segment.x === array[0] && segment.y === array[1]) {
        result = true;
        return result;
      }
    })

    return result;
  };

  var Apples = Game.Apples = function (board) {
    this.board = board;
    this.positions = [];
  }

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
    this.apples = []
    this.apple = new Apple(this);
    this.apples.push(this.apple.position);
    this.apple = new Apple(this);
    this.apples.push(this.apple.position);
    this.points = 0;
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

  Board.prototype.removeApple = function (coord) {
    for (var i = 0; i < this.apples.length; i++) {
      var applePos = this.apples[i];
      if (applePos.x == this.snake.head().x && applePos.y == this.snake.head().y) {
        var eatenAppleIndex = i;
      }
    }
    this.apples.splice(eatenAppleIndex, 1);
  };

})();
