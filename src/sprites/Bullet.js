import Phaser from 'phaser';
import PIXI from 'pixi';

export default class Bullet extends Phaser.Sprite {
    constructor({ game, x, y, asset, health }) {
        super(game, x, y, asset);

        this.game = game;
        this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

        this.anchor.setTo(0.5);
        this.health = health;

        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.exists = false;

        this.tracking = false;
        this.scaleSpeed = 0;
    }
    fire(x, y, angle, speed, gx, gy) {
        gx = gx || 0;
        gy = gy || 0;

        this.reset(x, y, this.health);
        this.scale.set(1);

        this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

        this.angle = angle;
        this.body.gravity.set(gx, gy);
    }
    update() {
        if (this.tracking) {
            this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
        }

        if (this.scaleSpeed > 0) {
            this.scale.x += this.scaleSpeed;
            this.scale.y += this.scaleSpeed;
        }
    }

}
