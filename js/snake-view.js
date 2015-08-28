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
    context.board = new Game.Board(20);
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
    var highScore = getItem("score");
    if (highScore) {
      $('.high-score').html(score)
    }
  };

  View.prototype.step = function () {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
    } else {
      alert("You lose! Your final score is " + this.board.points + ". Press Space to start a new game");
      window.clearInterval(this.intervalStep);
      setItem("score", this.board.points);
      debugger;
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
    $('.points').html("Points: " + points);
  };

  var docCookies = window.docCookies =  {
  getItem: function (sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    if (!sKey) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};
})();
