class InvaderProjectile{
    constructor({position,velocity}){
        this.position=position;
        this.velocity=velocity;
        this.width=4;
        this.height=12;
    }

    draw(){
        c.fillStyle="red";
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }

    update(){
        this.draw()
        this.position.x+=this.velocity.x;
        this.position.y+=this.velocity.y;
    }
}