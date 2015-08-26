(function () {
  var Game = window.Game = window.Game || {};

  var View = Game.View = function (el) {
    this.$el = el;

    this.board = new Game.Board(20);
    this.setupGrid();

    this.intervalStep = window.setInterval(
      this.step.bind(this),
      500
    );

    $(window).on("keydown", this.handleKeyEvent.bind(this));
  };

  View._Keys = {
    37: "W",
    38: "N",
    39: "E",
    40: "S"
  }

  View.prototype.handleKeyEvent = function (event) {
    var keycode = event.keyCode;

    if (View._Keys[keycode]) {
      this.board.snake.turn(View._Keys[keycode]);
    }
  };

  View.prototype.setupGrid = function () {
    var html = "";

    for (var i = 0; i < this.board.dim; i++) {
      html += "<div class='row'></div>";
      for (var j = 0; j < this.board.dim; j++) {
        html += "<div class='cell'></div>";
      }
      html += "</div>";
    }

    this.$el.html(html);
    this.$cell = this.$el.find(".cell");
  };

  View.prototype.step = function () {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
    } else {
      alert("You lose!");
      window.clearInterval(this.intervalStep);
    }

  };

  View.prototype.render = function () {
    this.updateSnakeClass(this.board.snake.segments);
    this.updateAppleClass([this.board.apple.position])
  };

  View.prototype.updateSnakeClass = function (coords) {
    this.$cell.filter(".snake").removeClass('snake');

    coords.forEach( function (coord) {
      var location = coord.x * this.board.dim + coord.y;
      this.$cell.eq(location).addClass('snake');
    }.bind(this));
  };

  View.prototype.updateAppleClass = function (coords) {
    this.$cell.filter(".apple").removeClass('apple');

    coords.forEach( function (coord) {
      var location = coord.x * this.board.dim + coord.y;
      this.$cell.eq(location).addClass('apple');
    }.bind(this));
  };
})();
