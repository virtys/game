import Phaser from 'phaser'
import Player from '../sprites/Player'
import Enemy from '../sprites/Enemy'
import StatusBar from '../sprites/StatusBar'
import Meteor from '../sprites/Meteor'

export default class extends Phaser.State {

    create() {
        this.background = this.add.tileSprite(0, 0, 800, 400, 'background');
        this.enemies = this.add.group();
        this.enemies.enableBody = true;

        this.player = new Player({
            game: this.game,
            x: 40,
            y: this.game.world.centerY,
            health: 100,
            asset: 'spaceship',
            frame: 1
        });

        this.game.stage.addChild(this.player);

        this.bar = new StatusBar({
            game: this.game,
            player: this.player
        });

        this.enemyTime = 0;
        this.enemyInterval = 1.8;
        this.enemyShootTime = 0;
        this.enemyShootInterval = 1;

        this.game.time.events.loop(Phaser.Timer.SECOND * 10, () => {
            if (this.enemyInterval > 0.2) {
                this.enemyInterval -= 0.1;
            }
        });

        // Create overlay
        this.overlayBitmap = this.add.bitmapData(this.game.width, this.game.height);
        this.overlayBitmap.ctx.fillStyle = '#000';
        this.overlayBitmap.ctx.fillRect(0, 0, this.game.width, this.game.height);
        this.overlay = this.add.sprite(0, 0, this.overlayBitmap);
        this.overlay.visible = false;
        this.overlay.alpha = 0.75;

        //sounds
        this.music = this.game.add.audio('playMusic');
        // this.bulletHitSound = this.add.sound('bulletHit');
        // this.enemyExplosionSound = this.add.sound('enemyExplosion');
        // this.playerExplosionSound = this.add.sound('playerExplosion');
        this.gameOverSound = this.add.sound('gameOver');
        this.music.loopFull();
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
                bulletSpeed: this.game.rnd.integerInRange(10, 20) * 10,
                asset: 'alien'
            });
        }

        if (this.enemyShootTime > this.enemyShootInterval) {
            this.enemyShootTime = 0;
            this.enemies.forEachAlive(enemy => enemy.shoot());
            if (!this.player.alive) {
                this.game.world.bringToTop(this.overlay);
            }
        }

        this.game.physics.arcade.overlap(this.player.bullets, this.enemies, this.hitEnemy, null, this);
        this.game.physics.arcade.overlap(this.player, this.enemies, this.crashEnemy, null, this);

        this.enemies.forEach(enemy => this.game.physics.arcade.overlap(this.player, enemy.bullets, this.hitPlayer, null, this));

        this.background.tilePosition.x -= 2;
    }

    createEnemy(data) {
        let enemy = this.enemies.getFirstExists(false);

        if (!enemy) {
            enemy = new Enemy(data);
            this.enemies.add(enemy);
        }
        enemy.reset(data);
    }

    hitEffect(obj, color) {
        let tween = this.game.add.tween(obj);
        let emitter = this.game.add.emitter();
        let emitterPhysicsTime = 0;
        let particleSpeed = 100;
        let maxParticles = 10;

        tween.to({
            tint: 0xff0000
        }, 100);
        tween.onComplete.add(() => {
            obj.tint = 0xffffff;
        });
        tween.start();

        emitter.x = obj.x;
        emitter.y = obj.y;
        emitter.gravity = 0;
        emitter.makeParticles('particle');

        if (obj.health <= 0) {
            particleSpeed = 200;
            maxParticles = 40;
            color = 0xff0000;
        }

        emitter.minParticleSpeed.setTo(-particleSpeed, -particleSpeed);
        emitter.maxParticleSpeed.setTo(particleSpeed, particleSpeed);
        emitter.start(true, 500, null, maxParticles);
        emitter.update = () => {
            emitterPhysicsTime += this.game.time.physicsElapsed;
            if (emitterPhysicsTime >= 0.6) {
                emitterPhysicsTime = 0;
                emitter.destroy();
            }
        };
        emitter.forEach(particle => particle.tint = color);
        if (!this.player.alive) {
            this.game.world.bringToTop(this.overlay);
        }
    }

    hitEnemy(bullet, enemy) {
        // this.bulletHitSound.play("", 0, 0.5);
        enemy.damage(bullet.health);
        this.hitEffect(enemy, bullet.tint);
        if (!enemy.alive) {
            // this.enemyExplosionSound.play("", 0, 0.5);
            this.bar.updateScore(enemy.maxHealth);
        }
        bullet.kill();
    }

    hitPlayer(player, bullet) {
        // this.bulletHitSound.play("", 0, 0.5);
        player.damage(bullet.health);
        this.bar.updateHealth();
        this.hitEffect(player, bullet.tint);
        if (!player.alive) {
            // this.playerExplosionSound.play();
            this.gameOver();
        }
        bullet.kill();
    }

    crashEnemy(player, enemy) {
        enemy.damage(enemy.health);
        player.damage(enemy.health);
        this.hitEffect(player);
        this.hitEffect(enemy);
        if (!enemy.alive) {
            // this.enemyExplosionSound.play("", 0, 0.5);
            this.bar.updateScore(enemy.maxHealth);
        }
        this.bar.updateHealth();
        if (!player.alive) {
            // this.playerExplosionSound.play();
            this.gameOver();
        }
    }
    gameOver() {
        this.game.time.slowMotion = 3;
        this.overlay.visible = true;
        this.game.world.bringToTop(this.overlay);
        let timer = this.game.time.create(this.game, true);
        timer.add(3000, () => {
            this.music.stop();
            this.gameOverSound.play();
            this.game.state.start('Over');
        });
        timer.start();
    }
}
