class Player{
    constructor(){
        this.velocity={x:0,y:0};
        this.rotation=0;
        this.opacity=1;
        this.powerUp=null;

        this.image=null;
        this.width=0;
        this.height=0;
        this.position={
            x:0,y:0
        }

        this.particles=[]
        this.frames=0;

        const image=new Image();
        image.src="./img/spaceship.png";
        image.onload=()=>{
            this.image=image;
            this.width=image.width*0.15;
            this.height=image.height*0.15;
            this.position={
                x:canvas.width/2-this.width/2,
                y:canvas.height-this.height-20
            }
        }
    }

    draw() {
        if(!this.image) return;

        c.save();
        c.globalAlpha=this.opacity;

        c.translate(
            this.position.x+this.width/2,
            this.position.y+this.height/2
        )

        c.rotate(this.rotation)

        c.translate(
            -this.position.x-this.width/2,
            -this.position.y-this.height/2
        )

            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
            c.restore()
    }

    update(){
        if(!this.image) return
        this.draw();
        this.position.x+=this.velocity.x;
    }

    



}