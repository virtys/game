import Phaser from 'phaser';
import Bullet from '../sprites/Bullet';

export default class Weapon extends Phaser.Group {
    constructor(game, bulletSpeed = 600) {
        super(game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = bulletSpeed;
        this.fireRate = 100;
        this.enableBody = true;

        for (let i = 0; i < 64; i += 1) {
            let bullet = new Bullet({
              game: this.game,
              x: this.x,
              y: this.y,
              health: 3,
              asset: 'bullet',
            });
            this.add(bullet, true);
        }
    }
    fire(source) {
        if (this.game.time.time < this.nextFire) {
            return;
        }

        const x = source.x;
        const y = source.y;

        this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

        this.nextFire = this.game.time.time + this.fireRate;
    }
}
