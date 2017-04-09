import Phaser from 'phaser';
import Enemy from '../sprites/Enemy';

export default class PowerUps extends Phaser.Group {
    constructor(game, interval) {
      super(game, game.world);

      this.game = game;
      this.enableBody = true;
      this.enemyTime = 0;
      this.enemyInterval = interval;
    }

    update() {
      this.enemyTime += this.game.time.physicsElapsed;

      if (this.enemyTime > this.enemyInterval) {
          this.enemyTime = 0;
          this.createEnemy({
              game: this.game,
              x: this.game.world.width,
              y: this.game.rnd.integerInRange(0, this.game.world.height),
              speed: {
                  x: -this.game.rnd.integerInRange(5, 10) * 10,
                  y: 0
              },
              health: 9,
              bulletSpeed: this.game.rnd.integerInRange(30, 35) * 10,
              asset: 'part' + this.game.rnd.integerInRange(1, 5)
          });
      }
    }

    createEnemy(data) {
        let enemy = this.getFirstExists(false);

        if (!enemy) {
            enemy = new Enemy(data);
            this.add(enemy);
        }
        enemy.reset(data);
    }
}
