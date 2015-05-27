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

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
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
    this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'gplaypattern');

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