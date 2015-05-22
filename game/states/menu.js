
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

    // Load bitmap fonts.
    this.game.load.bitmapFont('new-york-escape-cond',
      'assets/fonts/new-york-escape-cond.png', 'assets/fonts/new-york-escape-cond.fnt');

    // Load bitmap fonts.
    this.game.load.bitmapFont('new-york-escape-cond-grad',
      'assets/fonts/new-york-escape-cond-grad.png', 'assets/fonts/new-york-escape-cond-grad.fnt');

    // Load images.
    this.game.load.image('logo', 'assets/images/logo-lg.png');
    // Load images.
    this.game.load.image('gplaypattern', 'assets/images/gplaypattern.png');
  },
  create: function() {

    // Set stage color.
    this.game.stage.backgroundColor = '#ffffff';

    //  A grid background
    this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'gplaypattern');

    /*
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
    ]*/

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

    // Create animated letters.
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

    // Create the blue cross logo.
    //this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 50, 'logo');

    // Set the blue cross logo to be anchored to the center position.
   // this.logo.anchor.set(0.5);

    // Set the blue cross logo to be invincible by default.
    //this.logo.alpha = 0;

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

    // Display the logo.
    //this.game.add.tween(this.logo).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true,ellapseTime + 700, 0, false);
  },

  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;
