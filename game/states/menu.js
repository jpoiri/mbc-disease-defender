
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
