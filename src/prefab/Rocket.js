// Rocket prefab

//// NOTES ///////////

// ground-pounding is giving an INSANE amound of points
    // collision doesn't disable collidee sprite - there is some
    // latency before it resets to right of screen

//////////////////////

class Rocket extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, player01 = true, player02 = false, frame) {

        super(scene, x, y, texture, frame);

        this.sfxRocket = scene.sound.add('sfx_rocket');

        // add object to existing scene
        scene.add.existing(this);       // add to existing
        this.moveSpeed = 5;             // pixels to move per frame
        this.airSpeed = 10;

        // jump
        this.jumpPower = 20;
        this.smallJumpPower = 15;
        this.smallJumpDef = 15;
        this.yVel = this.jumpPower;

            // going up
        this.yDrag = 1.0;
        this.defDrag = 1.0;
        this.yAcc = 0.99;
        this.defAcc = 0.99;     // default

            // going down
        this.yBoost = 1.0;
        this.defBoost = 1.0;
        this.yDec = 0.99;
        this.defDec = 0.99;     // dafault

            // bouncing
        this.bounceAcc = 0.95;
        this.bounceDec = 0.95;
        this.timeMultiplier = 0.0;
        this.timeMultiplierDef = 0.0;
        this.pointMultiplier = 1;
        this.pointMultiplierDef = 1;


            // states
        this.peaked = false;    // start deceleration
        this.grounded = true;   // fell back down; reset
        this.jumping = false;   // is in process of jumping
        this.bouncing = false;  // is BOUNCING from collidee to collidee
        this.bonked = false;    // hit underside of collidee
        this.dropping = false;  // player executed ground-pound
        
        this.mouseActivated = false;
        this.downAvailable = false;

        this.score = 0;

            // multiplayer
        this.twoPlayersActivated = false
        this.player01 = player01;
        this.player02 = player02;
        this.spawning = false;
        this.active = true;

    }

    update() {      // update method

        if (!this.twoPlayersActivated && this.player01 && this.active) { this.singlePlayerUpdate() }    // if playing solo

        if (this.twoPlayersActivated && this.active) {                                 // if two player

            if (this.player01){             // player one uses keyboard
                this.playerOneUpdate();
            }

            if (this.player02){             // player two uses mouse
                this.playerTwoUpdate();
            }

        }

    }

    singlePlayerUpdate() {

        if (game.input.activePointer.isDown) { this.mouseActivated = true; }
        if (this.jumping && !game.input.activePointer.isDown) { this.downAvailable = true; }

        // left/right movement
        if ((keyLEFT.isDown || (game.input.mousePointer.x < this.x - 5 && this.mouseActivated)) && this.x >= borderUISize + this.width) {

            if (this.jumping){
                this.x -= this.airSpeed;    // floaty movement in the air
            } else {
                this.x -= this.moveSpeed;
            }

        } else if ((keyRIGHT.isDown || (game.input.mousePointer.x > this.x + 5 && this.mouseActivated)) && this.x <= game.config.width - borderUISize - this.width) {

            if (this.jumping){
                this.x += this.airSpeed;    // floaty movement in the air
            } else {
                this.x += this.moveSpeed;
            }

        }


        // jump button
        if ((Phaser.Input.Keyboard.JustDown(keyF) || game.input.activePointer.isDown) && this.grounded) { // keyF.isDown for constant, Phaser.Input.Keyboard.JustDown(keyF) for once
            
            console.log("jumping...")
            this.grounded = false;
            this.jumping = true;
            this.sfxRocket.play();
            
        }

        if ((Phaser.Input.Keyboard.JustDown(keyDOWN) && !this.grounded) || (game.input.activePointer.isDown && this.downAvailable)) { // keyDOWN.isDown for constant, Phaser.Input.Keyboard.JustDown(keyDOWN) for once
            
            console.log("going down...")
            this.dropping = true;
            this.jumping = false;
            this.bouncing = false;
            
        }
        
        // in the air, two states: jumping or ground-pounding (dropping)
        if (this.jumping) {
            this.jump();
        }

        if (this.dropping) {
            this.drop();
        }

    }

    playerOneUpdate() {

        // left/right movement
        if (keyLEFT.isDown && this.x >= borderUISize + this.width) {

            if (this.jumping){
                this.x -= this.airSpeed;    // floaty movement in the air
            } else {
                this.x -= this.moveSpeed;
            }

        } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {

            if (this.jumping){
                this.x += this.airSpeed;    // floaty movement in the air
            } else {
                this.x += this.moveSpeed;
            }

        }


        // jump button
        if (Phaser.Input.Keyboard.JustDown(keyF) && this.grounded) { // keyF.isDown for constant, Phaser.Input.Keyboard.JustDown(keyF) for once
            
            console.log("jumping...")
            this.grounded = false;
            this.jumping = true;
            this.sfxRocket.play();
            
        }

        if (Phaser.Input.Keyboard.JustDown(keyDOWN) && !this.grounded) { // keyDOWN.isDown for constant, Phaser.Input.Keyboard.JustDown(keyDOWN) for once
            
            console.log("going down...")
            this.dropping = true;
            this.jumping = false;
            this.bouncing = false;
            
        }
        
        // in the air, two states: jumping or ground-pounding (dropping)
        if (this.jumping) {
            this.jump();
        }


        if (this.dropping) {
            this.drop();
        }

    }

    playerTwoUpdate() {

        if (game.input.activePointer.isDown) { this.mouseActivated = true; }
        if (this.jumping && !game.input.activePointer.isDown) { this.downAvailable = true; }

        // left/right movement
        if ((game.input.mousePointer.x < this.x - 5 && this.mouseActivated) && this.x >= borderUISize + this.width) {

            if (this.jumping){
                this.x -= this.airSpeed;    // floaty movement in the air
            } else {
                this.x -= this.moveSpeed;
            }

        } else if ((game.input.mousePointer.x > this.x + 5 && this.mouseActivated) && this.x <= game.config.width - borderUISize - this.width) {

            if (this.jumping){
                this.x += this.airSpeed;    // floaty movement in the air
            } else {
                this.x += this.moveSpeed;
            }

        }


        // jump button
        if (game.input.activePointer.isDown && this.grounded) { // keyF.isDown for constant, Phaser.Input.Keyboard.JustDown(keyF) for once
            
            console.log("jumping...")
            this.grounded = false;
            this.jumping = true;
            this.sfxRocket.play();
            
        }

        if (game.input.activePointer.isDown && this.downAvailable) { // keyDOWN.isDown for constant, Phaser.Input.Keyboard.JustDown(keyDOWN) for once
            
            console.log("going down...")
            this.dropping = true;
            this.jumping = false;
            this.bouncing = false;
            
        }
        
        // in the air, two states: jumping or ground-pounding (dropping)
        if (this.jumping) {
            this.jump();
        }

        if (this.dropping) {
            this.drop();
        }

        if (this.spawning) {
            this.x -= 1;
        }

    }

    // reset rocket to "ground"
    groundReset() {

        this.y = game.config.height - borderUISize - borderPadding;     // back to ground
        this.jumping = false;                                           // jumping has stopped
        this.grounded = true;                                           // back on the ground
        this.dropping = false;                                          // can't drop further down
        this.peaked = false;
        this.bouncing = false;

        this.yAcc = this.defAcc;
        this.yDec = this.defDec;
        this.yVel = this.jumpPower;
        this.yDrag = this.defDrag;
        this.yBoost = this.defBoost;
        this.smallJumpPower = this.smallJumpDef;
        this.bonked = false;
        this.timeMultiplier = this.timeMultiplierDef;
        this.pointMultiplier = this.pointMultiplierDef;
        this.downAvailable = false;

        this.spawning = false;

    }

    bouncingReset() {

        // part that enables another jump
        this.peaked = false;

        this.yVel = this.smallJumpPower;    // each bounce goes a bit higher
        if (this.smallJumpPower < 18) {     // 20 smallJumpPower is the cap
            console.log("from rocket.js: jump power:", this.smallJumpPower);
            this.smallJumpPower += 2;
        }
        if (this.timeMultiplier < 0.50) {
            this.timeMultiplier += 0.25;
            console.log("from rocket.js: time multiplier:", this.timeMultiplier);
        }
        if (this.pointMultiplier < 5) {
            this.pointMultiplier += 1;
            console.log("from rocket.js: point multiplier:", this.pointMultiplier);
        }

        // reset deceleration on way up
        this.yDrag = this.defDrag;
        this.yDec = this.bounceDec;

        // reset acceleration on way down
        this.yBoost = this.defBoost;
        this.yAcc = this.bounceAcc;
        
        // possible to hit another underside now
        this.bonked = false;

    }

    jump() {

        if (this.player02 && this.twoPlayersActivated) { console.log("should be jumping...") }
        if (this.yVel <= 0) { this.peaked = true; }     // if velocity is at its minimum, jump has hit peak
        
        if (this.peaked) {              // start going down

            this.y += this.yVel;
            this.yVel += this.yBoost;
            this.yBoost *= this.yAcc;

        } else {                        // still going up

            this.y -= this.yVel;
            this.yVel -= this.yDrag;
            this.yDrag *= this.yDec;

        }

        if (this.y >= game.config.height - borderUISize - borderPadding){   // ground hit

            this.groundReset();

        }

    }

    smallJump() {

        this.bouncingReset();
        this.jump();

    }

    bonk() {

        this.peaked = true;     // starts descent
        this.yBoost = 4;        // starts it fast
        this.jump();            // when jump is entered with peaked = true, will go down

    }

    drop() {

        this.peaked = true;     // same story as bonk
        this.yBoost = 6;
        this.jump();

    }

    spawn(up = true){

        this.grounded = false;

        if (up) {

            console.log("huh?");
            this.grounded = false;
            this.jumping = true;
            this.sfxRocket.play();

            this.jump();

        this.spawning = true;

        } else {
            this.grounded = false;
            this.jumping = true;
            this.bonk();
        }

    }

    checkCollision(collidee) {

        if (this.active) {
          // simple AABB checking
          if (this.x < collidee.x + collidee.width &&       // check if rocket origin is to left of collidee's RIGHT bound
              this.x + this.width > collidee.x &&     // check if collidee origin is to left of ROCKET'S RIGHT bound
              this.y < collidee.y + collidee.height + 0 &&      // check if rocket origin is above collidee's LOWER bound
              this.height + this.y + 10 > collidee. y) {   // check if collidee origin is above ROCKET'S LOWER bound
              
              if (this.y > collidee.y && !this.peaked){   // if hit collidee's underside
                  this.bonked = true;
              } else {
                  this.bonked = false;
              }
              
              return true && collidee.activated;
  
            } else {
              return false;
            }
        
        }
    
    }

    collisionWrapper(collidee){

        if (this.checkCollision(collidee) && !this.twoPlayersActivated) {
            
            if (!this.bonked && !this.dropping) {
                this.smallJump();
            } else if (this.bonked) {
                this.bonk();
            }
  
            console.log("a collision happend...")
  
            collidee.explode(this);
  
        }
  
    }

}