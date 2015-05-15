
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

    // Load bitmap fonts.
    this.game.load.bitmapFont('new-york-escape-cond',
      'assets/fonts/new-york-escape-cond.png', 'assets/fonts/new-york-escape-cond.fnt');
    // Load images.
    this.game.load.image('bluecross-logo-large', 'assets/images/cross-large.png');
  },
  create: function() {

    // Set stage color.
    this.game.stage.backgroundColor = '#FFFFFF';

    this.chars = [
      {char: 'D', pos: [120,30]},
      {char: 'i', pos: [214,30]},
      {char: 's', pos: [249,30]},
      {char: 'e', pos: [334,30]},
      {char: 'a', pos: [422,30]},
      {char: 's', pos: [515,30]},
      {char: 'e', pos: [600,30]},
      {char: 'D', pos: [0 +40,135]},
      {char: 'e', pos: [93 +40,135]},
      {char: 'f', pos: [181 + 40,135]},
      {char: 'e', pos: [266 + 40,135]},
      {char: 'n', pos: [352 + 40,135]},
      {char: 'd', pos: [447 + 40,135]},
      {char: 'e', pos: [540 + 40,135]},
      {char: 'r', pos: [627 + 40,135]}
    ]

    this.animatedChars = [];

    for (var i = 0; i < this.chars.length; i++) {

      var animatedChar = this.game.add.bitmapText(this.chars[i].pos[0],
        this.chars[i].pos[1], 'new-york-escape-cond', this.chars[i].char, 130);

      animatedChar.alpha = 0;
      this.animatedChars.push(animatedChar);
    }

    // CLick start instruction.
    this.startTxt =  this.game.add.text(this.game.world.centerX, (this.game.world.centerY + 200),
      'Click to start defending', {
        font: '18pt Lato',
        fill: '#0093d0'
      })

    this.startTxt.anchor.set(0.5);
    this.startTxt.alpha = 0;

    // Cross
    this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 50, 'bluecross-logo-large');
    this.logo.anchor.set(0.5);
    this.logo.alpha = 0;

    var ellapseTime = 0;

    for (var i = 0; i < this.animatedChars.length; i++) {
      ellapseTime = 200 * i;
      this.game.add.tween(this.animatedChars[i]).to( { alpha: 1 }, 200,
        Phaser.Easing.Linear.None, true,ellapseTime, 0, true);
    }

    for (var i = 0; i < this.animatedChars.length; i++) {
      this.game.add.tween(this.animatedChars[i]).to( { alpha: 1 }, 1000,
        Phaser.Easing.Linear.None, true,ellapseTime + 1000, 0, false);
    }

    this.game.add.tween(this.startTxt).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true,ellapseTime + 1000, 0, false);
    this.game.add.tween(this.logo).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true,ellapseTime + 1000, 0, false);
  },

  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;
