
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
