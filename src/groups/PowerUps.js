import Phaser from 'phaser';

export default class PowerUps extends Phaser.Group {
  constructor(game, bonusType) {
    super(game, game.world);
    this.game = game;
    this.bonusType = bonusType;
    this.nextPowerTime = 0;
    this.powerRate = 2000;
  }
  update() {
    if (this.game.time.time < this.nextPowerTime) {
        return;
    }

    let power = new PowerUp({
      game: this.game,
      x: this.game.world.width,
      y: this.game.rnd.integerInRange(0, this.game.world.height),
      speed: {
          x: -this.game.rnd.integerInRange(5, 10) * 10,
          y: 0
      },
      value: 20,
      type: this.bonusType,
      asset: 'dsss' + this.game.rnd.integerInRange(1, 5)
    });

    power.reset({
      game: this.game,
      x: this.game.world.width,
      y: this.game.rnd.integerInRange(0, this.game.world.height),
      speed: {
          x: -this.game.rnd.integerInRange(5, 10) * 10,
          y: 0
      },
      value: 20,
      type: this.bonusType,
      asset: 'dsss'
    });

    this.nextPowerTime = this.game.time.time + this.powerRate;
  }

}

class PowerUp extends Phaser.Sprite {
  constructor({ game, x, y, asset, type, value }) {
      super(game, x, y, asset);
      this.powerType = type;
      this.powerValue = value;
      this.checkWorldBounds = true;
      this.outOfBoundsKill = true;
  }
}
