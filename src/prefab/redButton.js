class Button extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame, difficulty) {

        super(scene, x, y, texture, frame);
        scene.add.existing(this);

        this.easy = difficulty;
        this.activated = true;

    }

    update() {

    }

    explode(rocket) {

      if (this.activated){

        if (rocket.dropping) {
    
          // temporarily hide ship
          this.alpha = 0;
    
          // create explosion sprite at ship's position
    
          this.activated = false;
    
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

}