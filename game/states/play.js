'use strict';
function Play() {
}
Play.prototype = {

  preload: function () {
    this.game.load.image('spaceship-small', 'assets/images/spaceship-d-rotate-small.png');
    this.game.load.image('enemy', 'assets/images/spaceship-a-small.png');
    this.game.load.image('bullet', 'assets/images/bullet.png');
  },

  create: function () {

    // start the collision engine.
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    /*
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
     */

    this.enemies = this.game.add.group();
    this.enemies.enableBody = true;

    // Create new sprite and add it to the group
    for (var i = 0; i < 10; i++) {
      var enemy = this.enemies.create(this.game.world.randomX, this.game.world.randomY, 'enemy');
    }

    // Create the space ship
    this.ship = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'spaceship-small');
    this.ship.anchor.set(0.5);

    this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
    this.ship.body.allowRotation = false;

    /*
     this.game.add.tween(this.readyTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 500, 0, true);
     this.game.add.tween(this.startTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 2500, 0, true);
     this.game.add.tween(this.defendTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 4500, 0, true);
     this.game.add.tween(this.ship).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 6500, 0, false);
     */
  },
  update: function () {

    //Player ship follows the mouse
    this.ship.rotation = this.game.physics.arcade.moveToPointer(this.ship, 60, this.game.input.activePointer, 500);

    this.enemies.forEach(this.game.physics.arcade.moveToObject, this.game.physics.arcade, false, this.ship, 300);

    if (this.game.input.mousePointer.isDown) {

    }

  }
};

module.exports = Play;
