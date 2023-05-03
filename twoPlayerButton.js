class TwoPlayerButton extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame, multiplayer = false, confirms = 0) {

        super(scene, x, y, texture, frame);
        scene.add.existing(this);

        this.multiplayerActivated = multiplayer;
        this.confirms = confirms;

    }

    update() {

    }

}