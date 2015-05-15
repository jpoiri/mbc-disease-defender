
  'use strict';
  function Play() {}
  Play.prototype = {

    preload: function() {

      this.game.load.image('spaceship-small', 'assets/images/spaceship-small.png');

      // Load images.
      this.game.load.image('bullet', 'assets/images/bullet.png');
    },

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

      this.spaceship = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'spaceship-small');
      this.spaceship.anchor.set(0.5);
      this.spaceship.alpha = 0;

      this.game.add.tween(this.readyTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 500, 0, true);
      this.game.add.tween(this.startTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 2500, 0, true);
      this.game.add.tween(this.defendTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 4500, 0, true);
      this.game.add.tween(this.spaceship).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 6500, 0, false);
    },
    update: function() {

    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };

  module.exports = Play;
