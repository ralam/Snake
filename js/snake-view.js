(function () {
  var Game = window.Game = window.Game || {};

  var View = Game.View = function (el) {
    this.$el = el;

    this.ready = false;
    this.gameOver = true;

    // var that = this;
    // this.runGame(that);


    $(window).on("keydown", this.handleKeyEvent.bind(this));
  };

  View.prototype.runGame = function(context) {
    this.ready = true;
    this.gameOver = false;
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

    this.pauseGame(keycode);
    this.startGame(keycode);

    if (View._MovementKeys[keycode]) {
      this.board.snake.turn(View._MovementKeys[keycode]);
    }
  };

  View.prototype.pauseGame = function (keycode) {
    if (keycode === 27 && this.gameOver === false) {
      if (this.ready === true) {
        this.ready = false;
        window.clearInterval(this.intervalStep);
      } else {
        this.ready = true;
        this.intervalStep = window.setInterval(this.step.bind(this), 200);
      }
    }
  };

  View.prototype.startGame = function (keycode) {
    if (keycode === 32 && this.gameOver === true) {
      var that = this
      this.runGame(that);
    }
  }

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
      alert("You lose! Your final score is: " + this.board.points + ". Press Space to start a new game");
      window.clearInterval(this.intervalStep);
      this.gameOver = true;
    }

  };

  View.prototype.render = function () {
    this.updateClass(this.board.snake.segments, "snake");
    // this.updateClass([this.board.apple.position], "apple");
    this.updateClass(this.board.apples.positions, "apple");
    this.updatePoints(this.board.points);
  };

  View.prototype.updateClass = function (coords, className) {
    this.$cell.filter("." + className).removeClass(className);

    coords.forEach( function (coord) {
      var location = coord.x * this.board.dim + coord.y;
      this.$cell.eq(location).addClass(className);
    }.bind(this));
  }

  View.prototype.updatePoints = function (points) {
    $('.points').html("Points: " + points);
  };
})();
