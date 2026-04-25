class Invader {
    constructor({ position }){
        this.position=position;
        this.velocity={
            x: 0,
            y: 0
        }

        this.family=Math.random()<0.5?1:2;
        this.particleColor = this.family === 2 ? '#ff3b3b' : '#7d3cff';
      
        this.frames=0;
        this.frameHold=20;
        this.isUp=true;
      
        this.images={
            1:{
                up:new Image(),
                down:new Image()
            },
            2:{
                up:new Image(),
                down:new Image()
            }
        }

        this.images[1].up.src='./img/invaders/invaderUp1.png';
        this.images[1].down.src='./img/invaders/invaderDown1.png';
        this.images[2].up.src='./img/invaders/invaderUp2.png';
        this.images[2].down.src='./img/invaders/invaderDown2.png';

        const pair=this.images[this.family];

        pair.up.onload=()=>{
            this.image=pair.up;
            this.width=pair.up.width;
            this.height=pair.up.height;
        }

    }

    draw() {
        if (!this.image) return

        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
        )
    }

    update({ velocity }) {
        
        this.position.x+=velocity.x;
        this.position.y+=velocity.y;
        this.frames++;

        if(this.frames%this.frameHold===0){
            this.isUp=!this.isUp;
            const pair=this.images[this.family];
            this.image=this.isUp?pair.up:pair.down;
        }

        this.draw()
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