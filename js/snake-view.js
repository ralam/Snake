(function () {
  var Game = window.Game = window.Game || {};

  var View = Game.View = function (el) {
    this.$el = el;

    this.ready = false;
    this.gameOver = true;

    $(window).on("keydown", this.handleKeyEvent.bind(this));
  };

  View.prototype.runGame = function(context) {
    this.ready = true;
    this.gameOver = false;
    this.context= context;
    context.board = new Game.Board(20);
    context.modal = new Game.Modal();
    context.setupGrid();

    context.intervalStep = window.setInterval(
      context.step.bind(context),
      View.STEP_INTERVAL
    );
  };

  View.STEP_INTERVAL = 100;

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
        this.intervalStep = window.setInterval(this.step.bind(this), View.STEP_INTERVAL);
      }
    }
  };

  View.prototype.startGame = function (keycode) {
    if (keycode === 32 && this.gameOver === true) {
      if (typeof this.modal !== 'undefined') {
        this.modal.remove();
      }
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
    var highScore = Game.Utils.getItem("score");
    if (highScore) {
      $('.high-score').html("High score: " + highScore)
    }
  };

  View.prototype.step = function () {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
    } else {
      this.modal.render(this.board.points);
      this.listenToCloseModal();
      window.clearInterval(this.intervalStep);
      var highScore = Game.Utils.getItem("score");
      if (highScore < this.board.points) {
        Game.Utils.setItem("score", this.board.points);
      }

      this.gameOver = true;
    }

  };

  View.prototype.render = function () {
    this.updateClass(this.board.snake.segments, "snake");
    this.updateClass([this.board.snake.head()], "head");
    this.updateClass([this.board.snake.head()], this.board.snake.dir)
    this.updateClass(this.board.apples, "apple");
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
    $('.score').html("Score: " + points);
  };

  View.prototype.listenToCloseModal = function () {
    var that = this;
    $('.background').on('click', function(){
      if(that.gameOver) {
        that.modal.remove();
      };
    });
  };
})();
