class Button extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame, multiplayer = false) {

        super(scene, x, y, texture, frame);
        scene.add.existing(this);

        this.multiplayerActivated = multiplayer;

    }

    update() {

    }

}