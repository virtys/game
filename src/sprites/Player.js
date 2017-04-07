import Phaser from 'phaser';
import Bullet from './Bullet';

export default class Player extends Phaser.Sprite {
    constructor({ game, x, y, asset, frame, health }) {
        super(game, x, y, asset, frame);

        this.game = game;
        this.anchor.setTo(0.5);
        this.scale.setTo(0.5);
        this.angle = 90;
        this.speed = 300;
        this.health = health;
        this.maxHealth = health;

        this.game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;
        this.cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bulletSpeed = 400;
        this.fireRate = 300;
    }

    update() {

       this.body.velocity.set(0);

       /*Keyboard*/
       if (this.cursors.left.isDown) {
           this.body.velocity.x = -this.speed;
       }
       else if (this.cursors.right.isDown) {
           this.body.velocity.x = this.speed;
       }

       if (this.cursors.up.isDown) {
           this.body.velocity.y = -this.speed;
       }
       else if (this.cursors.down.isDown) {
           this.body.velocity.y = this.speed;
       }

       if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
          this.fire();
       }
    }

    fire() {
      if (this.game.time.time < this.nextFire) { return; }
      let bullet = this.bullets.getFirstExists(false);

      if (!bullet) {
          bullet = new Bullet({
              game: this.game,
              x: this.x,
              y: this.y,
              health: 3,
              asset: 'bullet',
              tint: 0x04c112
          });
          this.bullets.add(bullet);
          this.nextFire = this.game.time.time + this.fireRate;
      }
      else {
          bullet.reset(this.x, this.y, 3);
      }
      bullet.body.velocity.x = this.bulletSpeed;
    }

    damage(amount) {
        super.damage(amount);
    }

}
