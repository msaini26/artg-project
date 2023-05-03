class smallBoy extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame, pointValue = 60, miliseconds = 10000) {

        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.miliseconds = miliseconds;
        this.moveSpeed = game.settings.spaceshipSpeed * 2;
        this.go = false

    }

    update() {

        // move spaceship left
        if(this.go){

            this.x -= this.moveSpeed;

            // wrap around from left edge to right edge
            if(this.x <= 0 - this.width) {
                this.reset();
            }
        }

    }

    // pos reset
    reset() {
        //console.log("ship should reset...")
        this.x = game.config.width;
        this.go = false;
    }

}