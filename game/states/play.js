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

  createBitmapText: function (text) {
    var bitmapText = bitmapText = this.game.add.bitmapText(this.game.world.centerX,
        this.game.world.centerY, 'new-york-escape-cond', text, 130);
    bitmapText.alpha = 0;
    bitmapText.anchor.set(0.5);

    return bitmapText;
  },

  createScore: function() {
    return this.game.add.bitmapText(10,
      10, 'new-york-escape-cond', '0', 50);
  },

  createBulletsGroup: function() {
    var bulletsGrp = this.game.add.group();
    bulletsGrp.enableBody = true;
    bulletsGrp.createMultiple(50, 'bullet');
    bulletsGrp.addAll('checkWorldBounds', true);
    bulletsGrp.addAll('outOfBoundsKill', true);
    return bulletsGrp;
  },

  createDiseaseGroup: function() {
    var diseaseGrp = this.game.add.group();
    diseaseGrp.enableBody = true;
    diseaseGrp.setAll('alpha', '0');
    return diseaseGrp;
  },

  generateDiseases: function(spawnInternal, maxSpawnEnemies) {

    this.diseaseNames = [
      'disease-a',
      'disease-b',
      'disease-c',
      'disease-d',
      'disease-e',
      'disease-f',
      'disease-g'
    ];

    this.diseases = this.game.add.group();
    this.diseases.enableBody = true;
    this.diseases.setAll('alpha', '0');

    //Generated a new enemy every 1 sec.
    this.game.time.events.loop(Phaser.Timer.SECOND * spawnInternal, function () {

      if (this.diseases.length < maxSpawnEnemies) {

        var diseaseName = this.diseaseNames[Math.floor((Math.random() * 6))];

        var enemy = this.diseases.create(this.game.world.randomX, this.game.world.randomY, diseaseName);
        enemy.alpha = 0;
        //Change the alpha in 1 sec.
        this.game.add.tween(enemy).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500, 0, false);
      }
    }, this);

  },

  create: function () {

    this.maxSpawnEnemies = 100;
    this.spawnInterval = 1.25;
    this.fireRate = 50;
    this.nextFire = 0;
    this.score = 0;

    this.readyTxt = this.createBitmapText('Ready!');
    this.startTxt = this.createBitmapText('Start!');
    this.defendTxt =  this.createBitmapText('Defend!');
    this.scoreTxt = this.createScore();

    // start the collision engine.
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.generateDiseases(this.spawnInterval, this.maxSpawnEnemies);

    this.bullets = this.createBulletsGroup();

    // Add player ship
    this.ship = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'spaceship-small');

    this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);

    this.ship.anchor.set(0.5);
    //this.ship.alpha = 0;
    this.ship.body.allowRotation = false;

    //this.game.add.tween(this.readyTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 500, 0, true);
    //this.game.add.tween(this.startTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 2500, 0, true);
    //this.game.add.tween(this.defendTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 4500, 0, true);
    //this.game.add.tween(this.ship).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 6500, 0, false);
    //this.game.add.tween(this.diseases).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 6500, 0, false);
  },
  update: function () {

    for (var i = 1; i < 4; i++) {
      this.game.add.sprite(this.game.world.width - (70 * i), 10, 'spaceship-lives');
    }

    // Player ship follows the mouse
    if (!this.battleMode) {

      // When player is moving remove drag.
      this.ship.body.drag.set(1);

      this.ship.rotation = this.game.physics.arcade.moveToPointer(this.ship, 60, this.game.input.activePointer, 500);

    } else {

      // When player is in shooting position need add drag to immobilize ship.
      this.ship.body.drag.set(1000);

      // Update the ship rotation to match the angle of mouse pointer
      this.ship.rotation = this.game.physics.arcade.angleToPointer(this.ship);
    }

    this.diseases.forEach(this.game.physics.arcade.moveToObject, this.game.physics.arcade, false, this.ship, 60);

    if (this.game.input.mousePointer.isDown) {

      if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {

        this.nextFire = this.game.time.now + this.fireRate;

        var bullet = this.bullets.getFirstDead();

        bullet.reset(this.ship.x - 8, this.ship.y - 8);

        this.game.physics.arcade.moveToPointer(bullet, 300);
      }

      this.battleMode = true;
    }

    if (this.game.input.mousePointer.isUp) {
      this.battleMode = false;
    }

    this.scoreTxt.setText('' + this.score++);
  },

};

module.exports = Play;
