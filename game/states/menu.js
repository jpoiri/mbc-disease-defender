
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {
    this.game.load.bitmapFont('retro', 'assets/font.png', 'assets/font.fnt');
  },
  create: function() {


    this.game.stage.backgroundColor = '#FFFFFF';

    this.name = this.game.add.bitmapText(this.game.world.centerX,
      this.game.world.centerY, 'retro', 'Disease Defender +', 64);

    this.name.anchor.set(0.5);

    this.start = this.name = this.game.add.bitmapText(this.game.world.centerX,
      (this.game.world.centerY + 100), 'retro', 'Click to start to begin', 30);

    this.start.anchor.set(0.5);

    /*
    this.name = this.game.add.text(this.game.world.centerX,
      this.game.world.centerY,
      'Medavie Disease Defender', {
      font: '65px arial',
      fill: '#0078A7',
      align: 'center'
    });

    this.name.anchor.set(0.5);
    this.name.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 0);
    */

  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;
