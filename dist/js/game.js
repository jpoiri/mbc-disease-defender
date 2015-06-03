(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'mbc-disease-defender');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":2,"./states/gameover":3,"./states/menu":4,"./states/play":5,"./states/preload":6}],2:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],3:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {
    this.game.load.image('logo', 'assets/images/logo-sm.png');
  },
  create: function () {

    this.gameoverTxt = this.game.add.bitmapText(this.game.world.centerX,
      this.game.world.centerY - 180, 'new-york-escape-cond-grad', "Game Over", 100);
    this.gameoverTxt.anchor.set(0.5);

    // Chronic Disease Text
    this.chronicDiseaseTxt =  this.game.add.text(this.game.world.centerX, (this.game.world.centerY - 50),
      "Chronic diseases is not a game, it's a serious matter that affects people everyday lives.", {
        font: '18pt Lato',
        fill: '#0093d0'
      });

    this.chronicDiseaseTxt.wordWrap = true;
    this.chronicDiseaseTxt.wordWrapWidth = 600;
    this.chronicDiseaseTxt.anchor.set(0.5);

    // Chronic Disease Text
    this.visitWebsiteTxt =  this.game.add.text(this.game.world.centerX, (this.game.world.centerY + 50),
      "Please click to visit our website for more information.", {
        font: '18pt Lato',
        fill: '#0093d0'
      });

    this.visitWebsiteTxt.anchor.set(0.5);

    this.logo = this.game.add.sprite(this.game.world.centerX, (this.game.world.centerY + 150), 'logo');
    this.logo.anchor.set(0.5);

  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      //window.location.href = 'http://web-beta.medavie.bluecross.ca/en/index';
    }
  }
};
module.exports = GameOver;

},{}],4:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

    // Load bitmap fonts.
    this.game.load.bitmapFont('new-york-escape-cond',
      'assets/fonts/new-york-escape-cond.png', 'assets/fonts/new-york-escape-cond.fnt');

    this.game.load.bitmapFont('new-york-escape-cond-grad',
      'assets/fonts/new-york-escape-cond-grad.png', 'assets/fonts/new-york-escape-cond-grad.fnt');

    // Load image
    this.game.load.image('gplaypattern', 'assets/images/gplaypattern.png');
  },
  create: function() {

    // Set stage color.
    this.game.stage.backgroundColor = '#ffffff';

    //  A grid background
    //this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'gplaypattern');

    this.chars = [
      {char: 'D', pos: [120,130]},
      {char: 'i', pos: [214,130]},
      {char: 's', pos: [249,130]},
      {char: 'e', pos: [334,130]},
      {char: 'a', pos: [422,130]},
      {char: 's', pos: [515,130]},
      {char: 'e', pos: [600,130]},
      {char: 'D', pos: [40,235]},
      {char: 'e', pos: [133,235]},
      {char: 'f', pos: [221,235]},
      {char: 'e', pos: [306,235]},
      {char: 'n', pos: [392,235]},
      {char: 'd', pos: [487,235]},
      {char: 'e', pos: [580,235]},
      {char: 'r', pos: [667,235]}
    ]

    this.bitmapChars = [];

    // Create a bitmap text for each letter so we can animated it.
    for (var i = 0; i < this.chars.length; i++) {

      var bitmapChar = this.game.add.bitmapText(this.chars[i].pos[0],
        this.chars[i].pos[1], 'new-york-escape-cond-grad', this.chars[i].char, 130);

      // set the letter to be invincible by default.
      bitmapChar.alpha = 0;

      this.bitmapChars.push(bitmapChar);
    }

    // Create the start instruction.
    this.startTxt =  this.game.add.text(this.game.world.centerX, (this.game.world.centerY + 200),
      'Click to start defending', {
        font: '18pt Lato',
        fill: '#0093d0'
      })

    // Set the start instruction to be anchored to the center position.
    this.startTxt.anchor.set(0.5);

    // Set the start instruction to be invincible by default.
    this.startTxt.alpha = 0;

    var ellapseTime = 0;

    // For every character create tween for the alpha 2 sec delay for each letter
    for (var i = 0; i < this.bitmapChars.length; i++) {
      ellapseTime = 150 * i;
      this.game.add.tween(this.bitmapChars[i]).to( { alpha: 1 }, 150,
        Phaser.Easing.Linear.None, true,ellapseTime, 0, true);
    };

    // For every character create tween to display all letters.
    for (var i = 0; i < this.bitmapChars.length; i++) {
      this.game.add.tween(this.bitmapChars[i]).to( { alpha: 1 }, 700,
        Phaser.Easing.Linear.None, true,ellapseTime + 700, 0, false);
    }

    // Display the start instruction.
    this.game.add.tween(this.startTxt).to( { alpha: 1 }, 700, Phaser.Easing.Linear.None, true,ellapseTime + 700, 0, false);
  },

  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],5:[function(require,module,exports){
'use strict';

var FIRE_RATE = 50;
var SPAWN_INTERVAL = Phaser.Timer.SECOND * 1.25;
var UPDATE_SPAWN_INTERVAL = Phaser.Timer * 2;
var BITMAP_FONT = "new-york-escape-cond";
var NUM_OF_BULLETS = 50;
var NUM_OF_LIVES = 6;
var SHOOTING_DRAG = 1000;
var FLYING_DRAG = 1;

function Play() {
}
Play.prototype = {

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

  /**
   * Create game objects.
   */
  create: function () {

    this.readyTxt = this.createText('Ready!');
    this.startTxt = this.createText('Start!');
    this.defendTxt = this.createText('Defend!');

    // Create score sprite.
    this.scoreTxt = this.createScore();

    // Start collision engine.
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Create number of lives phaser group.
    this.numberOfLivesGrp = this.createNumberOfLivesGroup(NUM_OF_LIVES);

    // Create disease phaser group.
    this.diseaseGrp = this.createDiseaseGroup();

    // Generated a new disease every 1.25 sec.
    this.spawnTimer = this.game.time.events.loop(SPAWN_INTERVAL, this.spawnDisease, this, this.diseaseGrp);

    // Reduce the disease spawn time every 2 sec.
    this.game.time.events.loop(UPDATE_SPAWN_INTERVAL, this.updateSpawnInterval, this);

    // Create bullet group.
    this.bulletGrp = this.createBulletGroup(NUM_OF_BULLETS);

    // Create ship.
    this.ship = this.createShip();

    // Animated the intro text.
    //this.game.add.tween(this.readyTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 500, 0, true);
    //this.game.add.tween(this.startTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 2500, 0, true);
    //this.game.add.tween(this.defendTxt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 4500, 0, true);
    //this.game.add.tween(this.ship).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 6500, 0, false);
    //this.game.add.tween(this.diseases).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 6500, 0, false);
  },

  /**
   * Update game movement.
   */
  update: function () {

    // Handle when bullet hits a disease.
    this.game.physics.arcade.collide(this.bulletGrp, this.diseaseGrp, this.onBulletCollision, null, this);

    // Handle when a disease hits the player.
    this.game.physics.arcade.overlap(this.ship, this.diseaseGrp, this.onDiseaseCollision, null, this);

    // Player ship follows the mouse
    if (!this.battleMode) {

      // When player is moving remove drag.
      this.ship.body.drag.set(FLYING_DRAG);

      this.ship.rotation = this.game.physics.arcade.moveToPointer(this.ship, 60, this.game.input.activePointer, 300, 300);

    } else {

      // When player is in shooting position need add drag to immobilize ship.
      this.ship.body.drag.set(SHOOTING_DRAG);

      // Update the ship rotation to match the angle of mouse pointer
      this.ship.rotation = this.game.physics.arcade.angleToPointer(this.ship);
    }

    this.diseaseGrp.forEach(this.game.physics.arcade.moveToObject, this.game.physics.arcade, false, this.ship, 60);

    if (this.game.input.mousePointer.isDown) {

      if (this.game.time.now > this.nextFire && this.bulletGrp.countDead() > 0) {

        this.nextFire = this.game.time.now + FIRE_RATE;

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

  createText: function (text) {
    var bitmapText = bitmapText = this.game.add.bitmapText(this.game.world.centerX,
      this.game.world.centerY, BITMAP_FONT, text, 130);
    bitmapText.alpha = 0;
    bitmapText.anchor.set(0.5);
    return bitmapText;
  },

  /**
   * Create the score bitmap text.
   * @returns {Phaser.BitmapText}
   */
  createScore: function () {
    return this.game.add.bitmapText(10, 10, BITMAP_FONT, '0', 50);
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

  /**
   * Spawn disease
   * @param diseaseGrp The disease group
   */
  spawnDisease: function (diseaseGrp) {

    var disease = this.diseases[Math.floor((Math.random() * (this.diseases.length - 1)))];

    var diseaseSprite = diseaseGrp.create(this.game.world.randomX, this.game.world.randomY, disease.img);
    diseaseSprite.alpha = 0;
    diseaseSprite.points = disease.points;

    //Change the alpha in 1 sec.
    this.game.add.tween(diseaseSprite).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true, 300, 0, false);
  },

  /**
   * Update the spawn interval.
   */
  updateSpawnInterval: function () {
    if (this.spawnTimer && this.spawnTimer.delay) {
      this.spawnTimer.delay -= 80;
    }
  },

  /**
   * Handles when a bullet collides with a disease.
   * @param bullet The bullet
   * @param disease The disease.
   */
  onBulletCollision: function (bullet, disease) {
    disease.kill();
    bullet.kill();
    this.updateScore(disease.points);
  },

  /**
   * Handles when the ship collides with a disease.
   * @param ship The ship
   * @param disease The disease
   */
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
  }

};

module.exports = Play;

},{}],6:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('yeoman', 'assets/yeoman-logo.png');

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])