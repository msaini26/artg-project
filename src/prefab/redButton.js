class Button extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame, difficulty) {

        super(scene, x, y, texture, frame);
        scene.add.existing(this);

        this.easy = difficulty

    }

    update() {

    }

}