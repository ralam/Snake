(function () {
  var Game = window.Game = window.Game || {};
  var Modal = Game.Modal = function () {
    this.$background = $('<div></div>').addClass('inactive');
    this.$modal = $('<div></div>').addClass('inactive');
    $('body').append(this.$modal);
    $('body').append(this.$background);
  };

  Modal.prototype.updatePoints = function (points) {
    this.$modal.text("You lose! Your final score is " + points + ". Press Space to start a new game");
  }

  Modal.prototype.render = function (points) {
    this.updatePoints(points);
    this.$background.removeClass('inactive');
    this.$modal.removeClass('inactive');
    this.$background.addClass('background');
    this.$modal.addClass('modal');
  };

  Modal.prototype.remove = function () {
    this.$background.removeClass('background');
    this.$modal.removeClass('modal');
    this.$background.remove();
    this.$modal.remove();
  }
})();
