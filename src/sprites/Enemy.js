import Phaser from 'phaser';
import Weapon from '../groups/Weapon';

export default class Enemy extends Phaser.Sprite {

    constructor({ game, x, y, asset, frame, health, bulletSpeed }) {
        super(game, x, y, asset, frame);

        this.game = game;
        this.anchor.setTo(0.5);
        this.scale.setTo(0.5);
        this.health = health;
        this.maxHealth = health;
        this.game.physics.arcade.enable(this);
        this.bulletSpeed = - bulletSpeed;

        // this.shotSound = this.game.add.sound('enemyShot');
        this.weapon = new Weapon(this.game, this.bulletSpeed);
    }
    update() {

        if (this.position.y < 0.04 * this.game.world.height) {
            this.position.y = 0.04 * this.game.world.height + 2;
            this.body.velocity.y *= -1;
        }
        else if (this.position.y > 0.96 * this.game.world.height) {
            this.position.y = 0.96 * this.game.world.height - 2;
            this.body.velocity.y *= -1;
        }
    }
    fire() {
        this.weapon.fire(this);
    }
    damage(amount) {
        super.damage(amount);
    }
    reset({ x, y, health, bulletSpeed, speed }) {
        super.reset(x, y, health);
        this.bulletSpeed = bulletSpeed;
        this.body.velocity.x = speed.x;
        this.body.velocity.y = speed.y;
    }
}
