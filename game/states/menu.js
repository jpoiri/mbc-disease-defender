
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

    // Load bitmap fonts.
    this.game.load.bitmapFont('new-york-escape-3d',
      'assets/fonts/new-york-escape-3d.png', 'assets/fonts/new-york-escape-3d.fnt');
    this.game.load.bitmapFont('new-york-escape-cond',
      'assets/fonts/new-york-escape-cond.png', 'assets/fonts/new-york-escape-cond.fnt');
    this.game.load.bitmapFont('new-york-escape-grad',
      'assets/fonts/new-york-escape-grad.png', 'assets/fonts/new-york-escape-grad.fnt');
  },
  create: function() {

    // Set stage color.
    this.game.stage.backgroundColor = '#FFFFFF';

    this.diseaseTxt = this.game.add.bitmapText(this.game.world.centerX,
      (this.game.world.centerY - 100), 'new-york-escape-cond', 'Disease', 110);

    this.diseaseTxt.anchor.set(0.5);

    this.defenderTxt = this.game.add.bitmapText(this.game.world.centerX,
      this.game.world.centerY, 'new-york-escape-cond', 'Defender+', 110);
    this.defenderTxt.anchor.set(0.5);


    this.startTxt =  this.game.add.text(this.game.world.centerX, (this.game.world.centerX + 100),
      'Click to start defending', {
        font: '30px arial', fill: '#0078A7'})

    //this.startTxt = this.game.add.bitmapText(this.game.world.centerX,
      //(this.game.world.centerY + 100), 'new-york-escape-cond', 'Click to start defending', 25);

    this.startTxt.anchor.set(0.5);

  },

  createLato: function() {

    this.startTxt =  this.game.add.text(this.game.world.centerX, (this.game.world.centerX + 100),
      'Test', {
        font: '30px Lato', fill: '#0078A7'})
  },

  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;
