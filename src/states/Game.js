import Phaser from 'phaser';
import Player from '../sprites/Player';
import Aliens from '../groups/Aliens';
import Meteors from '../groups/Meteors';
import PowerUps from '../groups/PowerUps';
import StatusBar from '../groups/StatusBar';
import config from '../config';

export default class extends Phaser.State {

    create() {
        this.level = 1;
        this.background = this.add.tileSprite(0, 0, config.gameWidth, config.gameHeight, config.levels[this.level].background);

        this.player = new Player({
            game: this.game,
            x: 40,
            y: this.game.world.centerY,
            health: 30,
            asset: 'spaceship'
        });

        this.game.stage.addChild(this.player);

        this.bar = new StatusBar({
            game: this.game,
            player: this.player,
        });

        this.aliens = new Aliens(this.game, config.levels[this.level].enemiesInterval);
        this.meteors = new Meteors(this.game, config.levels[this.level].meteorsInterval);
        this.powerUps = new PowerUps(this.game, config.levels[this.level].bonusesInterval);

        game.time.events.add(1000 * config.levels[this.level].time, this.changeLevel, this)
        // Create overlay
        this.overlayBitmap = this.add.bitmapData(this.game.width, this.game.height);
        this.overlayBitmap.ctx.fillStyle = '#000';
        this.overlayBitmap.ctx.fillRect(0, 0, this.game.width, this.game.height);
        this.overlay = this.add.sprite(0, 0, this.overlayBitmap);
        this.overlay.visible = false;
        this.overlay.alpha = 0.75;

        // sounds
        this.music = this.game.add.audio('playMusic');
        this.gameOverSound = this.add.sound('gameOver');
        this.bonusSound = this.add.sound('takeBonus');
        this.music.loopFull();


        let text = game.add.text(this.game.world.centerX, this.game.world.centerY , config.levels[this.level].text, {
          font: "bold 32px Press Start 2P",
          fill: "#fff",
          align: "center",
        });
        text.anchor.set(0.5);
        setTimeout(function () {
          text.kill();
        }, 3000);

    }

    update() {

        this.game.physics.arcade.overlap(this.player.weapon, this.aliens, this.hitEnemy, null, this);
        this.game.physics.arcade.overlap(this.player, this.aliens, this.crashEnemy, null, this);
        this.game.physics.arcade.overlap(this.player, this.meteors, this.crashEnemy, null, this);
        this.game.physics.arcade.overlap(this.player, this.powerUps, this.takeBonus, null, this);
        this.aliens.forEach(alien => this.game.physics.arcade.overlap(this.player, alien.weapon, this.hitPlayer, null, this));

        this.background.tilePosition.x -= 2;
    }

    changeLevel() {
      if(!this.player.alive) return;
      this.level++;
      this.background.loadTexture(config.levels[this.level].background);
      if(config.levels[this.level] == undefined) {
        let text = game.add.text(this.game.world.centerX, this.game.world.centerY , "The End", {
          font: "bold 32px Arial",
          fill: "#fff",
          align: "center",
        });
        return false;
      }

      this.aliens.enemyInterval = config.levels[this.level].enemiesInterval;
      this.meteors.enemyInterval = config.levels[this.level].meteorsInterval;
      this.powerUps.enemyInterval = config.levels[this.level].bonusesInterval;

      this.aliens.forEachAlive((e)=>e.kill());
      this.meteors.forEachAlive((e)=>e.kill());
      this.powerUps.forEachAlive((e)=>e.kill());

      let text = game.add.text(this.game.world.centerX, this.game.world.centerY , config.levels[this.level].text, {
        font: "bold 32px Press Start 2P",
        fill: "#fff",
        align: "center",
      });
      text.anchor.set(0.5);
      setTimeout(function () {
        text.kill();
      }, 3000);

      game.time.events.add(1000 * config.levels[this.level].time, this.changeLevel, this);
    }

    hitEffect(obj, color) {
        const tween = this.game.add.tween(obj);

        tween.to({
            tint: 0xff0000
        }, 100);
        tween.onComplete.add(() => {
            obj.tint = 0xffffff;
        });
        tween.start();

        if (!this.player.alive) {
            this.game.world.bringToTop(this.overlay);
        }
    }

    hitEnemy(bullet, enemy) {
        enemy.damage(bullet.health);
        this.hitEffect(enemy, bullet.tint);
        if (!enemy.alive) {
            this.bar.updateScore(enemy.maxHealth);
        }
        bullet.kill();
    }

    hitPlayer(player, bullet) {
        player.damage(bullet.health);
        this.bar.updateHealth();
        this.hitEffect(player, 0xff0000);
        if (!player.alive) {
            this.gameOver();
        }
        bullet.kill();
    }

    takeBonus(player, bonus) {
      this.bonusSound.play();
      player.health += bonus.health;
      bonus.kill();
      this.bar.updateHealth();
    }

    crashEnemy(player, enemy) {
        player.damage(enemy.health);
        enemy.damage(enemy.health);
        this.hitEffect(player);
        this.hitEffect(enemy);
        if (!enemy.alive) {
            this.bar.updateScore(enemy.maxHealth);
        }
        this.bar.updateHealth();
        if (!player.alive) {
            this.gameOver();
        }
    }
    gameOver() {
        this.game.time.slowMotion = 3;
        this.overlay.visible = true;
        this.game.world.bringToTop(this.overlay);
        const timer = this.game.time.create(this.game, true);
        timer.add(3000, () => {
            this.music.stop();
            this.gameOverSound.play();
            let text = game.add.text(this.game.world.centerX, this.game.world.centerY , `You score: ${this.bar.score*10}\nGame Over`, {
              font: "bold 32px Press Start 2P",
              fill: "#fff",
              align: "center",
            });
            text.anchor.set(0.5);
            // this.game.state.start('Over');
        });
        timer.start();
    }
}
