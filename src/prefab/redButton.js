class Button extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame, difficulty) {

        super(scene, x, y, texture, frame);
        scene.add.existing(this);

        this.easy = difficulty

    }

    preload() {

        this.load.spritesheet('explosion', './assets/Rocket Patrol/explosion.png', {frameWidth: 64, frameHeight: 32, 
          startFrame: 0, endFrame: 9});
    
    }

    update() {

    }

    explode(rocket) {

        if (rocket.dropping) {
    
          // temporarily hide ship
          this.alpha = 0;
    
          // create explosion sprite at ship's position
          let boom = this.add.sprite(this.x, this.y, 'explosion').setOrigin(0, 0);
          boom.anims.play('explode');     //that one anims you created earlier - play it
          boom.on('animationcomplete', () => {
    
              //ship.reset();       // reset ship to right of screen
              boom.destroy();     // destroy explosion object
              this.alpha = 1;
    
              if (this.easy) {
    
                game.settings = {
                  spaceshipSpeed: 3,
                  gameTimer: 60000    
                }
    
                this.sound.play('sfx_select');
                this.scene.start('playScene'); 
    
              } else {
    
                game.settings = {
                  spaceshipSpeed: 4,
                  gameTimer: 45000    
                }
    
                this.sound.play('sfx_select');
                this.scene.start('playScene');  
    
              }
    
          });
    
          this.sound.play('sfx_explosion');
    
        } else if (!rocket.bonked) {
    
          this.y += 5;
    
          // create explosion sprite at ship's position
          let boom = this.add.sprite(this.x, this.y, 'explosion').setOrigin(0, 0);
          boom.alpha = 0;
          boom.anims.play('explode');     //that one anims you created earlier - play it
          boom.on('animationcomplete', () => {
    
              //ship.reset();       // reset ship to right of screen
              boom.destroy();     // destroy explosion object
              ship.y -= 5;
    
          });
        } else {
    
          this.y -= 5;
    
          // create explosion sprite at ship's position
          let boom = this.add.sprite(this.x, this.y, 'explosion').setOrigin(0, 0);
          boom.alpha = 0;
          boom.anims.play('explode');     //that one anims you created earlier - play it
          boom.on('animationcomplete', () => {
    
              //ship.reset();       // reset ship to right of screen
              boom.destroy();     // destroy explosion object
              this.y += 5;
    
          });
        }
    
      }

}