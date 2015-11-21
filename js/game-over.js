(function () {
  var Game = window.Game = window.Game || {};
  var Modal = Game.Modal = function (points) {
    this.points = points;
    this.$background = $('<div></div>').addClass('background');
    this.$modal = $('<div></div>').addClass('modal');
  };

  Modal.prototype.render = function () {
    this.$modal.text("You lose! Your final score is " + this.points + ". Press Space to start a new game")
    $('body').append(this.$modal);
    $('body').append(this.$background);
  };
})();
