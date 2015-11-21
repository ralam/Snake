(function () {
  var Game = window.Game = window.Game || {};
  var Modal = Game.Modal = function (points) {
    this.points = points;
    this.$background = $('<div></div>').addClass('background');
    this.$modal = $('<div></div>').addClass('modal');
  };

  Modal.prototype.render = function () {
    $('body').append(this.$modal);
    $('body').append(this.$background);
  };
})();
