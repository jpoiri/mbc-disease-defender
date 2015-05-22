'use strict';
function Play() {
}
Play.prototype = {


  preload: function () {
    this.game.load.image('spaceship-small', 'assets/images/ship-rotate-sm.png');
    this.game.load.image('spaceship-lives', 'assets/images/ship-sm.png')
    this.game.load.image('disease-a', 'assets/images/disease-a.png');
    this.game.load.image('disease-b', 'assets/images/disease-b.png');
    this.game.load.image('disease-c', 'assets/images/disease-c.png');
    this.game.load.image('disease-d', 'assets/images/disease-d.png');
    this.game.load.image('disease-e', 'assets/images/disease-e.png');
    this.game.load.image('disease-f', 'assets/images/disease-f.png');
    this.game.load.image('disease-g', 'assets/images/disease-g.png');
    this.game.load.image('bullet', 'assets/images/bullet.png');
  },

  createText: function() {
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
  },

  create: function () {

    this.maxSpawnEnemies = 100;
    this.spawnInterval = 1.25;

    this.createText();

    this.diseaseNames = ['disease-a','disease-b','disease-c', 'disease-d', 'disease-e', 'disease-f', 'disease-g'];

    // start the collision engine.
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.enemies = this.game.add.group();
    this.enemies.enableBody = true;
    this.enemies.setAll('alpha', '0');

    //Generated a new enemy every 1 sec.
    this.game.time.events.loop(Phaser.Timer.SECOND * this.spawnInterval, function() {

      if (this.enemies.length < this.maxSpawnEnemies) {

        var diseaseName = this.diseaseNames[Math.floor((Math.random() * 7))];

        var enemy = this.enemies.create(this.game.world.randomX, this.game.world.randomY, diseaseName);
        enemy.alpha = 0;
        //Change the alpha in 1 sec.
        this.game.add.tween(enemy).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500, 0, false);
      }
    }, this);

    // Add player ship
    this.ship = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'spaceship-small');
    this.ship.anchor.set(0.5);
    //this.ship.alpha = 0;

    this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);

    this.ship.body.allowRotation = false;

    //this.game.add.tween(this.readyTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 500, 0, true);
    //this.game.add.tween(this.startTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 2500, 0, true);
    //this.game.add.tween(this.defendTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 4500, 0, true);
    //this.game.add.tween(this.ship).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 6500, 0, false);
    //this.game.add.tween(this.enemies).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 6500, 0, false);
  },
  update: function () {

    this.game.add.bitmapText(10,
      10, 'new-york-escape-cond', '0', 50);

    for (var i = 1; i < 4; i++) {
      this.game.add.sprite(this.game.world.width - (70 * i), 10, 'spaceship-lives');
    }

    //Player ship follows the mouse
    this.ship.rotation = this.game.physics.arcade.moveToPointer(this.ship, 60, this.game.input.activePointer, 500);

    this.enemies.forEach(this.game.physics.arcade.moveToObject, this.game.physics.arcade, false, this.ship, 60);

    if (this.game.input.mousePointer.isDown) {

    }
  },

};

module.exports = Play;
