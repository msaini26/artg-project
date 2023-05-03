console.log("what is happening")

let config = {

    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play]

}

let game = new Phaser.Game(config);

// reserve keyboard vars

let keyF, keyR, keyLEFT, keyRIGHT, keyDOWN, clickLeft;

// set UI

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
