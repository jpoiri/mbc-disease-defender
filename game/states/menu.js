
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

    this.diseaseTxt = "Disease";
    this.updateIndex = 0;

    // Set stage color.
    this.game.stage.backgroundColor = '#FFFFFF';

    for (var i = 0; i < this.diseaseTxt.length; i++) {

      var letter = this.game.add.bitmapText(this.game.world.centerX + (i * 100),
        this.game.world.centerY, 'new-york-escape-cond', this.diseaseTxt.charAt(i), 130);

      letter.anchor.set(0.5);
      letter.alpha = 0;

      this.game.add.tween(letter).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true,1000, 0, false);
    }



    // Create game title.
    /*
    this.diseaseTxt = this.game.add.bitmapText(this.game.world.centerX,
      this.game.world.centerY - 200, 'new-york-escape-cond', '', 130);
    this.diseaseTxt.anchor.set(0.5);
    //this.diseaseTxt.alpha = 0;
    */


    /*
    this.defenderTxt = this.game.add.bitmapText(this.game.world.centerX,
      this.game.world.centerY -100, 'new-york-escape-cond', 'Defender', 130);
    this.defenderTxt.anchor.set(0.5);
    //this.defenderTxt.alpha = 0;

*/
    // CLick start instruction.
    this.startTxt =  this.game.add.text(this.game.world.centerX, (this.game.world.centerY + 200),
      'Click to start defending', {
        font: '18pt Lato',
        fill: '#0093d0'
      })

    this.startTxt.anchor.set(0.5);
    //this.startTxt.alpha = 0;

    // Cross
    this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 50, 'bluecross-logo-large');
    this.logo.anchor.set(0.5);
    //this.logo.alpha = 0;

    this.game.add.tween(this.diseaseTxt).to({ }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
    /*
    this.game.add.tween(this.defenderTxt).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true,1000, 0, false);
    this.game.add.tween(this.startTxt).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true,1500, 0, false);
    this.game.add.tween(this.logo).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true,1500, 0, false);
    */
  },

  update: function() {

    //var txt = this.diseaseTxt.text += this.testString.charAt(this.updateIndex)

    ///this.diseaseTxt.setText(txt);

    //this.updateIndex++;

    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;
