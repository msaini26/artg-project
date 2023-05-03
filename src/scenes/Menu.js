// Start-up screen

//// NOTES ///////////

// idea:
    // teach controls here
    // maybe start button has to be reached by jumping on top
        // hitting button underside "bonks"
        // maybe you have to ground-pound button to start
        // maybe you have to bounce to higher one for expert difficulty

//////////////////////
class Menu extends Phaser.Scene {

  constructor() {

    super('menuScene');

  }

  preload() {

    this.load.image('rocket', './assets/Rocket Patrol/rocket.png');
    this.load.image('rocket2', './assets/Rocket Patrol/rocket-2.png');
    this.load.image('redButton', './assets/Rocket Patrol/button-2.png.png');
    this.load.image('smallButton', './assets/Rocket Patrol/multiplayerButton.png');

    this.load.spritesheet('explosion', './assets/Rocket Patrol/explosion.png', {frameWidth: 64, frameHeight: 32, 
      startFrame: 0, endFrame: 9});

    this.load.audio('sfx_select', './assets/Rocket Patrol/blip_select12.wav')
    this.load.audio('sfx_explosion', './assets/Rocket Patrol/explosion38.wav')
    this.load.audio('sfx_rocket', './assets/Rocket Patrol/rocket_shot.wav')

  }

  create() {

      let menuConfig = {

          fontFamily: 'Courier',
          fontSize: '28px',
          backgroundColor: '#F3B141',
          color: "#843605",
          align: 'right',
          padding: {
              top: 5,
              bottom: 5,
          },
          fixedWidth: 0

      }

      this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding*15, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
      this.subtitle = this.add.text(game.config.width/2, game.config.height/2 + borderUISize*2 + borderPadding*2, 'Use <--> arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color - '#000';
      this.description = this.add.text(game.config.width/2 - borderUISize, game.config.height/2 + borderUISize*3 + borderPadding*3, 'left button novice, right expert', menuConfig).setOrigin(0.5);

      this.twoPlayerSubtitle = this.add.text(game.config.width/2, game.config.height/2 + borderUISize*2 + borderPadding*2, 'Two Player Activated!!', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color - '#000';
      this.twoPlayerDescription = this.add.text(game.config.width/2, game.config.height/2 + borderUISize*3 + borderPadding*3, 'player two is mouse', menuConfig).setOrigin(0.5);

      this.twoPlayerSubtitle.alpha = 0;
      this.twoPlayerDescription.alpha = 0;

      // the players

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        // add rocket (p2)
        this.p2Rocket = new Rocket(this, game.config.width + borderUISize*6, game.config.height - borderUISize - borderPadding, 'rocket2', false, true).setOrigin(0.5, 0);

        // define keys for controls

        keyF = 
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = 
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = 
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = 
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = 
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
      
      // the button
      this.easy = new Button(this, game.config.width/4, borderUISize*6 + borderPadding*4, 'redButton', 0, true).setOrigin(0, 0);
      this.expert = new Button(this, game.config.width/4 + borderUISize*10, borderUISize*4, 'redButton', 0, false).setOrigin(0, 0);
      
      this.twoPlayer = new Button(this, game.config.width/4 + borderUISize*12, borderUISize*10 + borderPadding*6, 'smallButton', 0, false).setOrigin(0, 0);
      this.twoPlayerConfirm = new TwoPlayerButton(this, game.config.width/2, borderUISize*6 + borderPadding*4, 'redButton', 0, false, 0).setOrigin(0, 0);
      this.twoPlayerConfirm.x -= this.twoPlayerConfirm.width/2
      this.twoPlayerConfirm.alpha = 0;

      this.twoPlayersActivated = false;

        // animation config for explosion
      this.anims.create({

        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
        frameRate: 30

    });

  }

  update() {

      this.p1Rocket.update();
      this.p2Rocket.update();

      this.collisionWrapper(this.p1Rocket, this.easy);
      this.collisionWrapper(this.p1Rocket, this.expert);

      this.smallButtonCollisionWrapper(this.p1Rocket, this.p2Rocket, this.twoPlayer)
      this.smallButtonCollisionWrapper(this.p2Rocket, this.p1Rocket, this.twoPlayer)

      this.twoPlayerCollisionWrapper(this.p1Rocket, this.twoPlayerConfirm)
      this.twoPlayerCollisionWrapper(this.p2Rocket, this.twoPlayerConfirm)

      this.rocketCollisionWrapper(this.p1Rocket, this.p2Rocket);

    }

    checkCollision(rocket, ship) {

      if (rocket.active) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&       // check if rocket origin is to left of ship's RIGHT bound
            rocket.x + rocket.width > ship.x &&     // check if ship origin is to left of ROCKET'S RIGHT bound
            rocket.y < ship.y + ship.height + 0 &&      // check if rocket origin is above ship's LOWER bound
            rocket.height + rocket.y + 10 > ship. y) {   // check if ship origin is above ROCKET'S LOWER bound
            
            if (rocket.y > ship.y && !rocket.peaked){   // if hit ship's underside
                rocket.bonked = true;
            } else {
                rocket.bonked = false;
            }
            
            return true;

          } else {
            return false;
          }
      
      }

  }

  buttonExplode(rocket, ship) {

    if (rocket.dropping) {

      console.log("hit by massive force")
      // temporarily hide ship
      ship.alpha = 0;

      // create explosion sprite at ship's position
      let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
      boom.anims.play('explode');     //that one anims you created earlier - play it
      boom.on('animationcomplete', () => {

          //ship.reset();       // reset ship to right of screen
          boom.destroy();     // destroy explosion object
          ship.alpha = 1;

          if (ship.easy) {

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

      ship.y += 5;

      // create explosion sprite at ship's position
      let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
      boom.alpha = 0;
      boom.anims.play('explode');     //that one anims you created earlier - play it
      boom.on('animationcomplete', () => {

          //ship.reset();       // reset ship to right of screen
          boom.destroy();     // destroy explosion object
          ship.y -= 5;

      });
    } else {

      ship.y -= 5;

      // create explosion sprite at ship's position
      let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
      boom.alpha = 0;
      boom.anims.play('explode');     //that one anims you created earlier - play it
      boom.on('animationcomplete', () => {

          //ship.reset();       // reset ship to right of screen
          boom.destroy();     // destroy explosion object
          ship.y += 5;

      });
    }

  }

  collisionWrapper(rocket, ship){

      if (this.checkCollision(rocket, ship) && !this.twoPlayersActivated) {
          
          if (!rocket.bonked && !rocket.dropping) {
              rocket.smallJump();
          } else if (rocket.bonked) {
              rocket.bonk();
          }

          console.log("a collision happend...")

          this.buttonExplode(rocket, ship);

      }

  }

  smallButtonCollisionWrapper(rocket01, rocket02, ship){

    if (this.checkCollision(rocket01, ship)) {
      
      if (!this.twoPlayersActivated && !rocket01.player02) {  // 2-player activated

        console.log("should be activating two-player...")

        rocket01.mouseActivated = false;

        this.subtitle.alpha = 0;
        this.description.alpha = 0;
        this.twoPlayerSubtitle.alpha = 1;
        this.twoPlayerDescription.alpha = 1;
        this.twoPlayerConfirm.alpha = 1;

        this.twoPlayersActivated = true;
        this.easy.alpha = 0;
        this.expert.alpha = 0;

        if (!rocket01.bonked && !rocket01.dropping) {

          rocket01.twoPlayersActivated = true;
          rocket02.twoPlayersActivated = true;

          rocket01.smallJump();

          rocket02.x = game.config.width/4 + borderUISize*12 
          rocket02.y = borderUISize*10 + borderPadding*7
          rocket02.spawn(false);

        } else if (rocket01.bonked) {
          
          rocket01.twoPlayersActivated = true;
          rocket02.twoPlayersActivated = true;

          rocket01.bonk();

          rocket02.x = game.config.width/4 + borderUISize*12 
          rocket02.y = borderUISize*10 + borderPadding*5
          rocket02.spawn();

        }

        console.log("a collision happend...")

      } else {    // player 2 deactivating

        this.twoPlayerConfirm.confirms = 0;

        if (rocket01.player02) {

          this.subtitle.alpha = 1;
          this.description.alpha = 1;
          this.twoPlayerSubtitle.alpha = 0;
          this.twoPlayerDescription.alpha = 0;
          this.twoPlayerConfirm.alpha = 0;

          this.twoPlayersActivated = false;
          this.easy.alpha = 1;
          this.expert.alpha = 1;

          rocket02.twoPlayersActivated = false;
          rocket01.x = game.config.width + borderUISize*6;
          rocket01.twoPlayersActivated = false;

          rocket02.active = true;
          rocket02.x = this.twoPlayerConfirm.x + ship.width;
          rocket02.y = this.twoPlayerConfirm.width + borderUISize*6;

          return;

        }

        // player 1 deactivating

        rocket02.groundReset();
        this.subtitle.alpha = 1;
        this.description.alpha = 1;
        this.twoPlayerSubtitle.alpha = 0;
        this.twoPlayerDescription.alpha = 0;
        this.twoPlayerConfirm.alpha = 0;

        this.twoPlayersActivated = false;
        this.easy.alpha = 1;
        this.expert.alpha = 1;

        rocket01.twoPlayersActivated = false;
        rocket02.twoPlayersActivated = false;
        rocket02.x = game.config.width + borderUISize*6
        rocket02.active = true;

        if (!rocket01.bonked && !rocket01.dropping) {

          rocket01.smallJump();

        } else if (rocket01.bonked) {
          
          rocket01.bonk();

          }

      }

    }

  }

  rocketCheckCollision(rocket, ship) {

    if (rocket.active && ship.active) {
      // simple AABB checking
      if (rocket.x < ship.x + ship.width &&       // check if rocket origin is to left of ship's RIGHT bound
          rocket.x + rocket.width > ship.x &&     // check if ship origin is to left of ROCKET'S RIGHT bound
          rocket.y < ship.y + ship.height + 0 &&      // check if rocket origin is above ship's LOWER bound
          rocket.height + rocket.y + 10 > ship. y) {   // check if ship origin is above ROCKET'S LOWER bound
          
          if (rocket.y > ship.y && !rocket.peaked){   // if hit ship's underside
            rocket.bonked = true;
            ship.bonked = false;
          } else if (rocket.y < ship.y && !ship.peaked){   // if hit ship's underside
            rocket.bonked = false;
            ship.bonked = true;
          } else if (rocket.y == ship.y) {

            if (rocket.x > ship.x) {

              rocket.x += 20;
              ship.x -= 20;

            }
            if (rocket.x < ship.x) {

              rocket.x -= 20;
              ship.x += 20;

            }

            return false;

          }
          
          return true;

        } else {
          return false;
        }
    }
  }

  rocketCollisionWrapper(rocket01, rocket02){

    if (this.rocketCheckCollision(rocket01, rocket02)) {

        console.log("rockets collided!");
        
        if (!rocket01.bonked&& !rocket01.grounded) {            // player 1 bounces on player 2

          console.log("rocket one jump")
          rocket01.jumping = true;
          rocket01.bonked = false;
          rocket01.grounded = false;
          rocket01.smallJump();

          rocket02.bonked = true;
          rocket02.bonk()

        } else if (!rocket02.bonked && !rocket02.grounded) {  // player 2 bounces on player 1

          console.log("rocket two jump")
          rocket01.bonked = true;  
          rocket01.bonk();

          rocket02.bonked = false;
          rocket02.jumping = true;
          rocket02.grounded = false;
          rocket02.smallJump();

        }

    }

  }

  twoPlayerButtonExplode(rocket, ship) {

    if (rocket.dropping) {

      console.log("hit by massive force")

      rocket.x = ship.x + ship.width/2;
      rocket.y = game.config.width + borderUISize*6;
      rocket.active = false;
      ship.confirms += 1;
      
      if (ship.confirms >= 2) { // if both players have confirmed multiplayer
        ship.alpha = 0;

        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');     //that one anims you created earlier - play it
        boom.on('animationcomplete', () => {

            //ship.reset();       // reset ship to right of screen
            boom.destroy();     // destroy explosion object
            ship.alpha = 1;

            game.settings = {
              spaceshipSpeed: 3,
              gameTimer: 60000    
            }
            this.scene.start('twoPlayer'); 

        });

        this.sound.play('sfx_explosion');
      } else {           // one swallowed but not both

        ship.y += 20;
  
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.alpha = 0;
        boom.anims.play('explode');     //that one anims you created earlier - play it
        boom.on('animationcomplete', () => {
  
            //ship.reset();       // reset ship to right of screen
            boom.destroy();     // destroy explosion object
            ship.y -= 20;
  
        });

        console.log("should've receded...")
      }

    } else if (!rocket.bonked) {

      ship.y += 5;

      // create explosion sprite at ship's position
      let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
      boom.alpha = 0;
      boom.anims.play('explode');     //that one anims you created earlier - play it
      boom.on('animationcomplete', () => {

          //ship.reset();       // reset ship to right of screen
          boom.destroy();     // destroy explosion object
          ship.y -= 5;

      });
    } else {

      ship.y -= 5;

      // create explosion sprite at ship's position
      let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
      boom.alpha = 0;
      boom.anims.play('explode');     //that one anims you created earlier - play it
      boom.on('animationcomplete', () => {

          //ship.reset();       // reset ship to right of screen
          boom.destroy();     // destroy explosion object
          ship.y += 5;

      });
    }

  }

  twoPlayerCollisionWrapper(rocket, ship){

    if (this.checkCollision(rocket, ship) && this.twoPlayersActivated) {
        
        if (!rocket.bonked && !rocket.dropping) {
            rocket.smallJump();
        } else if (rocket.bonked) {
            rocket.bonk();
        }

        console.log("a collision happend...")

        this.twoPlayerButtonExplode(rocket, ship);

    }

}

}