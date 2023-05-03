class Button extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame, difficulty) {

        super(scene, x, y, texture, frame);
        scene.add.existing(this);

        this.easy = difficulty;

    }

    update() {

    }

    explode(rocket) {

        if (rocket.dropping) {
    
          // temporarily hide ship
          this.alpha = 0;
    
          // create explosion sprite at ship's position
          this.alpha = 1;
    
            if (this.easy) {
    
                game.settings = {
                  spaceshipSpeed: 3,
                  gameTimer: 60000    
                }
    
            } else {
    
                game.settings = {
                  spaceshipSpeed: 4,
                  gameTimer: 45000    
                }
    
            }
    
        } else if (!rocket.bonked) {
    
          this.y += 5;
    
            // figure out the delay + animation

          this.y -= 5;
    

        } else {
    
          this.y -= 5;
    
          // figure out the delay
          
          this.y += 5;
    
        }
        
    
    }

}