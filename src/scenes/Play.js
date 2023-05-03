// Gameplay scene

//// NOTES ///////////

// create LARGER collision checker
    // checks state of rocket:
        // ground-pounding
        // bouncing
        // bonking
    // would just make things cleaner

// balance time recovery
    // maybe start by recovering .25 sec on first bounce
        // additional bouncing provide more
        // cap could be 1 second or so
    // additionally, missed spaceships could also deduct, but maybe not
    // provide indicator of how much is being earned back

//////////////////////

class Play extends Phaser.Scene {

    constructor() {

        super('playScene');

    }

    preload() {     // assets to use

        this.load.image('rocket', './assets/Rocket Patrol/rocket.png');
        this.load.image('spaceship', './assets/Rocket Patrol/spaceship.png');
        this.load.image('starfield', './assets/Rocket Patrol/starfield.png');
        this.load.image('swordfish', './assets/Rocket Patrol/swordfish.png');
        this.load.spritesheet('explosion', './assets/Rocket Patrol/explosion.png', {frameWidth: 64, frameHeight: 32, 
            startFrame: 0, endFrame: 9});

    }

    create() {      // happens exactly once at beginning

        console.log("no bug here");

    // the set-up

        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
    
        // UI - score
        let scoreConfig = {

            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {

                top: 5,
                bottom: 5,

            },
            fixedWidth: 100

        }
        this.config2 = scoreConfig
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, 0, this.config2);

        // UI - fire!
        this.fireUI = this.add.text(game.config.width/2, borderUISize + borderPadding*2, "FIRE!", scoreConfig);
        this.fireUI.alpha = 0;

        // 60-second play clock
        this.gameOver = false;      // flag for game over state

        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {

            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER, LOSER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Try Again or <- for Menu!', scoreConfig).setOrigin(0.5);
            this.gameOver = true;

        }, null, this);

        // UI - clock
        this.remainingTime = game.settings.gameTimer/1000;
        this.clockUI = this.add.text(borderUISize + borderUISize*15, borderUISize + borderPadding*2, this.remainingTime, scoreConfig);
    
    // the player

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

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

        this.mouseActive = false;

    // the enemy

        // add spaceships (x3) + my small boy
        this.swordfish = new smallBoy(this, game.config.width, borderUISize*6 + borderPadding*3, 'swordfish', 0, 60).setOrigin(0, 0);

        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0, 0);
        
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0, 0);

        // animation config for explosion
        this.anims.create({

            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30

        });

        // speed up!
        var speedUp = this.time.addEvent({
            delay: 30000,                // ms
            callback: this.shipsSpeedUp,
            //args: [],
            callbackScope: this,
            loop: true
        });

        var swordShipGo = this.time.addEvent({
            delay: 30000,                // ms
            callback: this.swordfishSpawn,
            //args: [],
            callbackScope: this,
            loop: true
        });

    
    }

    update() {      // does once every frame

    // time
        this.remainingTime = Math.floor(this.clock.getRemainingSeconds());
        this.clockUI.text = this.remainingTime;

    // restart check
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
    
    // just the environment
        this.starfield.tilePositionX -= 4;

    // sprite movements
        if (!this.gameOver) {       // if game's still goin

            if (!this.p1Rocket.grounded) {
                this.fireUI.alpha = 1;
            } else {
                this.fireUI.alpha = 0;
            }

            this.p1Rocket.update();

            this.ship01.update();
            this.ship02.update();
            this.ship03.update();

            this.swordfish.update();
        
        }

    // check collisions
        
        this.collisionWrapper(this.p1Rocket, this.ship03);
        
        this.collisionWrapper(this.p1Rocket, this.ship02);

        this.collisionWrapper(this.p1Rocket, this.ship01);

        this.collisionWrapper(this.p1Rocket, this.swordfish);

    }

    checkCollision(rocket, ship) {

        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&       // check if rocket origin is to left of ship's RIGHT bound
            rocket.x + rocket.width > ship.x &&     // check if ship origin is to left of ROCKET'S RIGHT bound
            rocket.y < ship.y + ship.height &&      // check if rocket origin is above ship's LOWER bound
            rocket.height + rocket.y > ship. y) {   // check if ship origin is above ROCKET'S LOWER bound
            
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

    addTime(miliseconds) {

        this.clock.delay += miliseconds;

    }
    shipExplode(rocket, ship) {

        // increment timer
        if (rocket.bouncing) {  // if combo started

            console.log("multiplier:", rocket.timeMultiplier)
            this.addTime(ship.miliseconds * rocket.timeMultiplier);

        }
        // temporarily hide ship
        ship.alpha = 0;

        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');     //that one anims you created earlier - play it
        ship.reset();       // reset ship to right of screen
        ship.alpha = 1;     // reset ship visibility to full
            
        boom.on('animationcomplete', () => {

            boom.destroy();     // destroy explosion object

        });

        // score incrementation
        rocket.score += ship.points * rocket.pointMultiplier;
        this.scoreLeft.text = rocket.score;

        this.sound.play('sfx_explosion');

    }

    collisionWrapper(rocket, ship){

        if (this.checkCollision(rocket, ship)) {
            
            if (!rocket.bonked && !rocket.dropping) {
                rocket.bouncing = true;
                rocket.smallJump();
            } else if (rocket.bonked) {
                rocket.bonk();
            }

            this.shipExplode(rocket, ship);

        }

    }

    shipsSpeedUp(){

        console.log("speeding up!");
        this.ship01.moveSpeed *= 1.5;
        this.ship02.moveSpeed *= 1.5;
        this.ship03.moveSpeed *= 1.5;
        this.swordfish.moveSpeed *= 1.5;

    }

    swordfishSpawn(){
        this.swordfish.go = true;
    }

}