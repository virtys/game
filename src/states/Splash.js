import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg');
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');
    centerGameObjects([this.loaderBg, this.loaderBar]);

    this.load.setPreloadSprite(this.loaderBar);

    //
    // load your assets
    //
    this.load.image('background', 'assets/images/bg.png');
    this.load.image('spaceship', 'assets/images/spaceship.png');
    this.load.image('bullet', 'assets/images/laser.png');
    this.load.image('alien', 'assets/images/alien.png');
    this.load.image('asteroid', 'assets/images/meteor.png');
    this.load.image('hudBg', 'assets/images/hud-bg.png');
    this.load.image('healthbar', 'assets/images/healthbar.png');
    this.load.image('particle', 'assets/images/particle.gif');

    this.load.audio('playMusic', ['assets/sounds/play.mp3']);
    this.load.audio('gameOver', ['assets/sounds/game-over.mp3']);

  }

  create () {
    this.state.start('Game')
  }
}
