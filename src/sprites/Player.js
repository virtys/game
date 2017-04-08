import Phaser from 'phaser';
import Weapon from '../groups/Weapon';

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

        this.weapon = new Weapon(this.game);
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
          this.weapon.fire(this);
       }
    }

    damage(amount) {
        super.damage(amount);
    }

}
