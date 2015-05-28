'use strict';
function Play() {
}
Play.prototype = {

  fireRate: 50,
  spawnInterval: 1.25,
  score: 0,
  nextFire: 0,
  diseases: [
    {
      name: 'disease-a',
      img: 'disease-a',
      points: 100
    },
    {
      name: 'disease-b',
      img: 'disease-b',
      points: 200
    },
    {
      name: 'disease-c',
      img: 'disease-c',
      points: 300
    },
    {
      name: 'disease-d',
      img: 'disease-d',
      points: 400
    },
    {
      name: 'disease-e',
      img: 'disease-e',
      points: 500
    },
    {
      name: 'disease-f',
      img: 'disease-f',
      points: 600
    },
    {
      name: 'disease-g',
      img: 'disease-g',
      points: 700
    },
  ],

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

  createText: function (text) {
    var bitmapText = bitmapText = this.game.add.bitmapText(this.game.world.centerX,
      this.game.world.centerY, 'new-york-escape-cond', text, 130);
    bitmapText.alpha = 0;
    bitmapText.anchor.set(0.5);
    return bitmapText;
  },

  /**
   * Create the score bitmap text.
   * @returns {Phaser.BitmapText}
   */
  createScore: function () {
    return this.game.add.bitmapText(10,
      10, 'new-york-escape-cond', '0', 50);
  },

  /**
   * Creates number of lives group.
   * @param numberOfLives The number of lives.
   * @returns {Phaser.Group}
   */
  createNumberOfLivesGroup: function (numberOfLives) {
    var numberOfLivesGrp = this.game.add.group();
    if (numberOfLivesGrp) {
      for (var i = 1; i < (numberOfLives + 1); i++) {
        numberOfLivesGrp.create(this.game.world.width - (70 * i), 10, 'spaceship-lives');
      }
    }
    return numberOfLivesGrp;
  },

  /**
   * Create the bullet group.
   * @param numberOfBullets The number of bullets.
   * @returns {Phaser.Group}
   */
  createBulletGroup: function (numberOfBullets) {
    var bulletGrp = this.game.add.group();
    if (bulletGrp) {
      bulletGrp.enableBody = true;
      bulletGrp.createMultiple(numberOfBullets, 'bullet');
      bulletGrp.addAll('checkWorldBounds', true);
      bulletGrp.addAll('outOfBoundsKill', true);
    }
    return bulletGrp;
  },

  /**
   * Create the disease group.
   * @returns {Phaser.Group}
   */
  createDiseaseGroup: function () {
    var diseaseGrp = this.game.add.group();
    if (diseaseGrp) {
      diseaseGrp.enableBody = true;
      diseaseGrp.setAll('alpha', '0');
    }
    return diseaseGrp;
  },

  /**
   * Create the ship sprite.
   * @returns {Phaser.Sprite}
   */
  createShip: function () {
    var ship = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'spaceship-small');
    if (ship) {
      this.game.physics.enable(ship, Phaser.Physics.ARCADE);
      ship.anchor.set(0.5);
      //this.ship.alpha = 0;
      ship.body.allowRotation = false;
    }
    return ship;
  },

  spawnDiseases: function (diseaseGrp, spawnInterval) {

    //Generated a new enemy every 1 sec.
    this.spawnTimer = this.game.time.events.loop(Phaser.Timer.SECOND * spawnInterval, this.spawnDisease, this, diseaseGrp);
  },

  spawnDisease: function(diseaseGrp) {

    var disease = this.diseases[Math.floor((Math.random() * (this.diseases.length - 1)))];
    var diseaseSprite = diseaseGrp.create(this.game.world.randomX, this.game.world.randomY, disease.img);

    diseaseSprite.alpha = 0;
    diseaseSprite.points = disease.points;

    //Change the alpha in 1 sec.
    this.game.add.tween(diseaseSprite).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true, 300, 0, false);
  },

  onBulletCollision: function (bullet, disease) {
    disease.kill();
    bullet.kill();
    this.updateScore(disease.points);
  },

  onDiseaseCollision: function (ship, disease) {
    if (!this.ship.invincible && disease.alpha === 1) {
      this.hurt();
      if (this.isGameOver()) {
        this.game.state.start("gameover");
      } else {
        this.ship.invincible = true;
        this.ship.alpha = 0.5;
        this.game.time.events.add(Phaser.Timer.SECOND * 0.75, function () {
          this.ship.invincible = false;
          this.ship.alpha = 1;
        }, this);
      }
    }
  },

  /**
   * Hurt player.
   */
  hurt: function () {
    if (this.numberOfLivesGrp && this.numberOfLivesGrp.getFirstAlive()) {
      this.numberOfLivesGrp.getAt(this.numberOfLivesGrp.countLiving() - 1).kill();
    }
  },

  /**
   * Check if the game is over.
   * @returns {boolean}
   */
  isGameOver: function () {
    if (this.numberOfLivesGrp && !this.numberOfLivesGrp.countLiving()) {
      return true;
    } else {
      return false;
    }
  },

  updateScore: function (points) {
    this.score += points;
    this.scoreTxt.setText(this.score.toString());
  },

  create: function () {

    this.readyTxt = this.createText('Ready!');
    this.startTxt = this.createText('Start!');
    this.defendTxt = this.createText('Defend!');
    this.scoreTxt = this.createScore();

    // start the collision engine.
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.numberOfLivesGrp = this.createNumberOfLivesGroup(6);

    this.diseaseGrp = this.createDiseaseGroup();

    this.spawnDiseases(this.diseaseGrp, this.spawnInterval);

    // Create bullet group.
    this.bulletGrp = this.createBulletGroup(50);

    // Create ship.
    this.ship = this.createShip();

    //this.game.add.tween(this.readyTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 500, 0, true);
    //this.game.add.tween(this.startTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 2500, 0, true);
    //this.game.add.tween(this.defendTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 4500, 0, true);
    //this.game.add.tween(this.ship).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 6500, 0, false);
    //this.game.add.tween(this.diseases).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 6500, 0, false);
  },
  update: function () {

    // Handle when bullet hits a disease.
    this.game.physics.arcade.collide(this.bulletGrp, this.diseaseGrp, this.onBulletCollision, null, this);

    // Handle when a disease hits the player.
    this.game.physics.arcade.overlap(this.ship, this.diseaseGrp, this.onDiseaseCollision, null, this);

    // Player ship follows the mouse
    if (!this.battleMode) {

      // When player is moving remove drag.
      this.ship.body.drag.set(1);

      this.ship.rotation = this.game.physics.arcade.moveToPointer(this.ship, 60, this.game.input.activePointer, 300, 300);

    } else {

      // When player is in shooting position need add drag to immobilize ship.
      this.ship.body.drag.set(1000);

      // Update the ship rotation to match the angle of mouse pointer
      this.ship.rotation = this.game.physics.arcade.angleToPointer(this.ship);
    }

    this.diseaseGrp.forEach(this.game.physics.arcade.moveToObject, this.game.physics.arcade, false, this.ship, 60);

    if (this.game.input.mousePointer.isDown) {

      if (this.game.time.now > this.nextFire && this.bulletGrp.countDead() > 0) {

        this.nextFire = this.game.time.now + this.fireRate;

        var bullet = this.bulletGrp.getFirstDead();

        bullet.reset(this.ship.x - 8, this.ship.y - 8);

        this.game.physics.arcade.moveToPointer(bullet, 300);
      }

      this.battleMode = true;
    }

    if (this.game.input.mousePointer.isUp) {
      this.battleMode = false;
    }

  },

};

module.exports = Play;
