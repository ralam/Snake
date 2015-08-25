(function(){
  var Game = window.Game = window.Game || {};

  var View = Game.View = function (el) {
    this.$el = el;

    this.board = new Game.Board(20);

    var intervalStep = window.setInterval(
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
    var keycode = event.keydown();

    if (View._Keys[keycode]) {
      this.board.snake.turn(View._Keys[keycode]);
    }
  };

  View.prototype.step = function () {
    this.board.snake.move();
    this.render();
  }

  View.prototype.render = function () {

  }
);
