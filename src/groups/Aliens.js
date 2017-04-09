import Phaser from 'phaser';
import Enemy from '../sprites/Enemy';

export default class Aliens extends Phaser.Group {
    constructor(game, enemyInterval) {
      super(game, game.world);

      this.game = game;
      this.enableBody = true;
      this.enemyTime = 0;
      this.enemyInterval = enemyInterval;
      this.enemyShootTime = 0;
      this.enemyShootInterval = 1;

      this.game.time.events.loop(Phaser.Timer.SECOND * 10, () => {
          if (this.enemyInterval > 0.2) {
              this.enemyInterval -= 0.1;
          }
      });
    }

    update() {
      this.enemyTime += this.game.time.physicsElapsed;
      this.enemyShootTime += this.game.time.physicsElapsed;

      if (this.enemyTime > this.enemyInterval) {
          this.enemyTime = 0;
          this.createEnemy({
              game: this.game,
              x: this.game.rnd.integerInRange(6, 76) * 10,
              y: 0,
              speed: {
                  x: this.game.rnd.integerInRange(5, 10) * 10 * (Math.random() > 0.5 ? 1 : -1),
                  y: this.game.rnd.integerInRange(5, 10) * 10
              },
              health: 9,
              bulletSpeed: this.game.rnd.integerInRange(30, 35) * 10,
              asset: 'enemy'+ this.game.rnd.integerInRange(1, 6)
          });
      }

      if (this.enemyShootTime > this.enemyShootInterval) {
          this.enemyShootTime = 0;
          this.forEachAlive(enemy => enemy.fire());
      }
    }
    setEnemyIterval(interval) {
      this.enemyInterval = interval;
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
