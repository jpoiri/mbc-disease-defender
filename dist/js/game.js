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
    // Load images.
    this.game.load.image('bluecross-logo-large', 'assets/images/cross-large.png');
    // Load images.
    this.game.load.image('gplaypattern', 'assets/images/gplaypattern.png');
  },
  create: function() {

    // Set stage color.
    this.game.stage.backgroundColor = '#ffffff';

    //  A grid background
    this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'gplaypattern');

    this.chars = [
      {char: 'D', pos: [120,30]},
      {char: 'i', pos: [214,30]},
      {char: 's', pos: [249,30]},
      {char: 'e', pos: [334,30]},
      {char: 'a', pos: [422,30]},
      {char: 's', pos: [515,30]},
      {char: 'e', pos: [600,30]},
      {char: 'D', pos: [40,135]},
      {char: 'e', pos: [133,135]},
      {char: 'f', pos: [221,135]},
      {char: 'e', pos: [306,135]},
      {char: 'n', pos: [392,135]},
      {char: 'd', pos: [487,135]},
      {char: 'e', pos: [580,135]},
      {char: 'r', pos: [667,135]}
    ]

    this.animatedChars = [];

    // Create animated letters.
    for (var i = 0; i < this.chars.length; i++) {

      var animatedChar = this.game.add.bitmapText(this.chars[i].pos[0],
        this.chars[i].pos[1], 'new-york-escape-cond', this.chars[i].char, 130);

      // set the letter to be invincible by default.
      animatedChar.alpha = 0;
      this.animatedChars.push(animatedChar);
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

    // Create the blue cross logo.
    this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 50, 'bluecross-logo-large');

    // Set the blue cross logo to be anchored to the center position.
    this.logo.anchor.set(0.5);

    // Set the blue cross logo to be invincible by default.
    this.logo.alpha = 0;

    var ellapseTime = 0;

    // For every character create tween for the alpha 2 sec delay for each letter
    for (var i = 0; i < this.animatedChars.length; i++) {
      ellapseTime = 200 * i;
      this.game.add.tween(this.animatedChars[i]).to( { alpha: 1 }, 200,
        Phaser.Easing.Linear.None, true,ellapseTime, 0, true);
    };

    // For every character create tween to display all letters.
    for (var i = 0; i < this.animatedChars.length; i++) {
      this.game.add.tween(this.animatedChars[i]).to( { alpha: 1 }, 1000,
        Phaser.Easing.Linear.None, true,ellapseTime + 1000, 0, false);
    }

    // Display the start instruction.
    this.game.add.tween(this.startTxt).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true,ellapseTime + 1000, 0, false);

    // Display the logo.
    this.game.add.tween(this.logo).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true,ellapseTime + 1000, 0, false);
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