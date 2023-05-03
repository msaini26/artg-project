class Spaceship extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame, pointValue, miliseconds = 1000) {

        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.miliseconds = miliseconds;
        this.moveSpeed = game.settings.spaceshipSpeed;
        this.direction = "left";

    }

    update() {

        // move spaceship left
        if (this.direction == "left") {

            this.x -= this.moveSpeed;
            // wrap around from left edge to right edge
            if(this.x <= 0 - this.width) {
                //console.log(this.x);
                // Sconsole.log(" - hit left - ", 0 - this.width);
                this.reset(this.direction);
            }

        }

        if (this.direction == "right") {

            this.x += this.moveSpeed;
            // wrap around from left edge to right edge
            if(this.x >= game.config.width) {
                console.log(this.x);
                console.log(" - hit right - ", this.width);
                this.reset(this.direction);
            }
            
        }

    }

    // pos reset
    reset(whichWay = "uknown") {

        console.log("resetting...");

        if (whichWay == "left") {

            this.x = game.config.width;

        } else if (whichWay == "right") {

            this.x = 0;
            
        } else {

            let roll = Math.floor(Math.random() * 2);
            console.log("rolled", roll)

            if (!roll) {                // spawn on right, going left

                this.direction = "left";
                this.x = game.config.width;
                this.flipX = false;
                console.log("should now move left!")

            }

            if (roll) {                // spawn on left, going right

                this.direction = "right";
                this.x = 0;
                this.flipX = true;
                console.log("should now move right!")
                console.log(this.direction);

            }

        }
    }

}