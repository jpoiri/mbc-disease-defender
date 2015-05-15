
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {

      this.readyTxt = this.game.add.bitmapText(this.game.world.centerX,
        this.game.world.centerY, 'new-york-escape-cond', 'Ready!', 130);
      this.readyTxt.alpha = 0;
      this.readyTxt.anchor.set(0.5);

      this.startTxt = this.game.add.bitmapText(this.game.world.centerX,
        this.game.world.centerY, 'new-york-escape-cond', 'Start!', 130);
      this.startTxt.alpha = 0;
      this.startTxt.anchor.set(0.5);

      this.defendTxt = this.game.add.bitmapText(this.game.world.centerX,
        this.game.world.centerY, 'new-york-escape-cond', 'Defend!', 130);
      this.defendTxt.alpha = 0;
      this.defendTxt.anchor.set(0.5);

      this.game.add.tween(this.readyTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 1000, 0, true);
      this.game.add.tween(this.startTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 3000, 0, true);
      this.game.add.tween(this.defendTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 5000, 0, true);
    },
    update: function() {

    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };

  module.exports = Play;
