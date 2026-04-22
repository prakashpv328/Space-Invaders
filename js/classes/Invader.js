class Invader {
    constructor({ position }){
        this.velocity={
            x: 0,
            y: 0
        }
      
        this.image = null
        this.width = 0
        this.height = 0
        this.position = null
      
        this.frames={
            up:new Image(),
            down:new Image()
        }
      
        this.frames.up.src='./img/invaders/invaderUp1.png'
        this.frames.down.src='./img/invaders/invaderDown1.png'
      
        this.currentFrame='up'
        this.lastSwapTime=performance.now()
        this.swapInterval=1000
      
        this.frames.up.onload= () => {
            const scale=1
            this.image=this.frames.up
            this.width=this.image.width*scale
            this.height=this.image.height*scale
            this.position={
                x:position.x,
                y:position.y
            }
        }
    }

    swapSprinteByTime(){
        const now = performance.now();
        if(now - this.lastSwapTime > this.swapInterval){
            this.currentFrame=this.currentFrame==='up'?'down':'up';
            this.image=this.currentFrame==='up'?this.frames.up:this.frames.down;
            this.lastSwapTime=now;
        }
    }

    draw() {
        if (!this.image || !this.position) return

        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    update({ velocity }) {
        if (!this.image || !this.position) return

        this.swapSprinteByTime()

        this.draw()
        this.position.x+=velocity.x
        this.position.y+=velocity.y
    }

    shoot(invaderProjectiles){
        if(!this.position) return;
        audio.enemyShoot.play();

        invaderProjectiles.push(
            new InvaderProjectile({
                position:{
                    x:this.position.x+this.width/2,
                    y:this.position.y+this.height
                },
                velocity:{
                    x:0,
                    y:5
                }
            })
        )
    }
}