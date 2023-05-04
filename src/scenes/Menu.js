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

    this.load.image('rocket', './assets/characters/duck.png');
    this.load.image('rocket2', './assets/characters/rocket-2.png');
    this.load.image('redButton', './assets/buttons/button-2.png.png');
    this.load.image('smallButton', './assets/buttons/multiplayerButton.png');
    this.load.image('starfield', './assets/background/sky.png'); // import sky background

    this.load.spritesheet('explosion', './assets/spritesheets/explosion.png', {frameWidth: 64, frameHeight: 32, 
      startFrame: 0, endFrame: 9});

    this.load.audio('sfx_select', './assets/audio/blip_select12.wav')
    this.load.audio('sfx_explosion', './assets/audio/explosion38.wav')
    this.load.audio('sfx_rocket', './assets/audio/rocket_shot.wav')

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
      
      // this.add.tileSprite(0, 0, 640, 480,'starfield').setOrigin(0, 0);

      this.sky = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0); // place background tile sprite

      this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding*15, 'THE QUACKENING', menuConfig).setOrigin(0.5);
      //change text to start
      this.subtitle = this.add.text(game.config.width/2, game.config.height/2 + borderUISize*2 + borderPadding*2, 'Press -> arrow to start', menuConfig).setOrigin(0.5);
//      this.subtitle = this.add.text(game.config.width/2, game.config.height/2 + borderUISize*2 + borderPadding*2, 'Use -> arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
      //   menuConfig.backgroundColor = '#00FF00';
      //   menuConfig.color - '#000';
      // this.description = this.add.text(game.config.width/2 - borderUISize, game.config.height/2 + borderUISize*3 + borderPadding*3, 'left button novice, right expert', menuConfig).setOrigin(0.5);

      // this.twoPlayerSubtitle = this.add.text(game.config.width/2, game.config.height/2 + borderUISize*2 + borderPadding*2, 'Two Player Activated!!', menuConfig).setOrigin(0.5);
      //   menuConfig.backgroundColor = '#00FF00';
      //   menuConfig.color - '#000';
      // this.twoPlayerDescription = this.add.text(game.config.width/2, game.config.height/2 + borderUISize*3 + borderPadding*3, 'player two is mouse', menuConfig).setOrigin(0.5);

      // this.twoPlayerSubtitle.alpha = 0;
      // this.twoPlayerDescription.alpha = 0;

      // the players

        // add rocket (p1)
//        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding*10, 'rocket').setOrigin(0.5, 0);

        // define keys for controls

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
      
      // the button

      // this.easy = new Button(this, game.config.width/4, borderUISize*6 + borderPadding*4, 'redButton', 0, true).setOrigin(0, 0);
      // this.expert = new Button(this, game.config.width/4 + borderUISize*10, borderUISize*4, 'redButton', 0, false).setOrigin(0, 0);
      
      // animation config for explosion
      this.anims.create({

        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
        frameRate: 30

    });

  }

  update() {

      // this.p1Rocket.update();

      // this.p1Rocket.collisionWrapper(this.easy);
      // this.p1Rocket.collisionWrapper(this.expert);
      if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
        this.sound.play('sfx_select');
        this.scene.start('playScene');

      }
 

  }

}