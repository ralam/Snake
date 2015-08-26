(function () {
  var Game = window.Game = window.Game || {};

  var View = Game.View = function (el) {
    this.$el = el;

    this.ready = false;

    // this.startScreen(this.$el)
    // var that = this;
    //
    // $(".points").on("keydown", this.runGame(that));
    var that = this;
    this.runGame(that);


    $(window).on("keydown", this.handleKeyEvent.bind(this));
  };

  View.prototype.runGame = function(context) {
    this.ready = true;
    context.board = new Game.Board(20);
    context.setupGrid();

    context.intervalStep = window.setInterval(
      context.step.bind(context),
      200
    );
  };

  // View.prototype.startScreen = function ($el) {
  //   var points = "<div class=points>Welcome to Snake.\n Use the arrow keys to control the snake.\n Grow your snake by eating apples.\n Press any key to start.</div>";
  //
  //   $el.append(points);
  // }

  View._MovementKeys = {
    37: "W",
    38: "N",
    39: "E",
    40: "S"
  }

  View.prototype.handleKeyEvent = function (event) {
    var keycode = event.keyCode;

    if (keycode === 27) {
      if (this.ready === true) {
        this.ready = false;
        window.clearInterval(this.intervalStep);
      } else {
        this.ready = true;
        this.intervalStep = window.setInterval(this.step.bind(this), 200);
      }
    };

    if (View._MovementKeys[keycode]) {
      this.board.snake.turn(View._MovementKeys[keycode]);
    }
  };

  View.prototype.setupGrid = function () {
    var html = "";
    var points = "<div class=points></div>";

    for (var i = 0; i < this.board.dim; i++) {
      html += "<div class='row'></div>";
      for (var j = 0; j < this.board.dim; j++) {
        html += "<div class='cell'></div>";
      }
      html += "</div>";
    }

    this.$el.html(html);
    this.$el.append(points);
    this.$cell = this.$el.find(".cell");
  };

  View.prototype.step = function () {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
    } else {
      alert("You lose! Your final score is: " + this.board.points);
      window.clearInterval(this.intervalStep);
    }

  };

  View.prototype.render = function () {
    this.updateSnakeClass(this.board.snake.segments);
    this.updateAppleClass([this.board.apple.position]);
    this.updatePoints(this.board.points);
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

  View.prototype.updatePoints = function (points) {
    $('.points').html("Points: " + points);
  };
})();
