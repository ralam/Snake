(function () {
  var Game = window.Game = window.Game || {};

  var Coord = Game.Coord = function (x, y) {
    this.x = x;
    this.y = y;
  }

  var Snake = Game.Snake = function (board) {
    this.dir = "N";
    this.board = board;
  };

  Snake.DIRS = {
    "N": new Coord(-1, 0),
    "E": new Coord(0, 1),
    "S": new Coord(1, 0),
    "W": new Coord(0, -1)
  }
})
