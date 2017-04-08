import Phaser from 'phaser';
import Enemy from '../sprites/Enemy';

export default class Meteors extends Phaser.Group {
    constructor(game, player) {
      super(game, game.world);

      this.game = game;
      this.player = player;
      this.enableBody = true;
      this.enemyTime = 0;
      this.enemyInterval = 3;
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
              health: 20,
              bulletSpeed: this.game.rnd.integerInRange(10, 20) * 10,
              asset: 'meteor' + this.game.rnd.integerInRange(1, 5)
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
