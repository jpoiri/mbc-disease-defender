
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
