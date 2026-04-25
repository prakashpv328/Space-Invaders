class Bomb{
    static radius=30

    constructor({position,velocity}){
        this.position=position;
        this.velocity=velocity;
        this.radius=0;
        this.color='red';
        this.opacity=1;
        this.active=false;

        gsap.to(this,{
            radius:30
        })
    }

    draw(){
        c.save();
        c.globalAlpha=this.opacity;
        c.beginPath();
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2);
        c.closePath();
        c.fillStyle=this.color
        c.fill()
        c.restore();
    }

    update(){
        this.draw()
        this.position.x+=this.velocity.x;
        this.position.y+=this.velocity.y;

        if(this.position.x+this.radius+this.velocity.x>=canvas.width || 
            this.position.x-this.radius+this.velocity.x<=0){
                this.velocity.x=-this.velocity.x;
            }
        else if(this.position.y+this.radius+this.velocity.y>=canvas.height || 
            this.position.y-this.radius+this.velocity.y<=0){
            this.velocity.y=-this.velocity.y;
        }
    }

    explode(){
        audio.bomb.play();
        this.active=true;
        this.velocity.x=0
        this.velocity.y=0;

        gsap.to(this,{
            radius:200,
            color:'white'
        })

        gsap.to(this,{
            delay:0.1,
            opacity:0,
            duration:0.15
        })
    }
}

class PowerUp {
    constructor({ position, velocity, type = 'random' }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        
        if (type === 'random') {
            this.type = Math.random() < 0.5 ? 'machineGun' : 'shield';
        } else {
            this.type = type;
        }

        if (this.type === 'machineGun') {
            this.color = 'yellow';
            this.glowColor = 'rgba(255, 255, 0, 0.5)';
            this.particleColor = 'yellow';
        } else if (this.type === 'shield') {
            this.color = 'blue';
            this.glowColor = 'rgba(0, 170, 255, 0.5)';
            this.particleColor = 'cyan';
        }

        this.pulse = 0;
    }

    draw() {
        c.save();

        this.pulse += 0.1;
        const pulseSize = Math.sin(this.pulse) * 3;

        const gradient = c.createRadialGradient(
            this.position.x, this.position.y, this.radius - 5,
            this.position.x, this.position.y, this.radius + 10 + pulseSize
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.5, this.glowColor);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius + 10 + pulseSize, 0, Math.PI * 2);
        c.fillStyle = gradient;
        c.fill();

        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius + pulseSize, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();

        c.beginPath();
        c.arc(this.position.x, this.position.y, (this.radius + pulseSize) * 0.5, 0, Math.PI * 2);
        c.fillStyle = 'rgba(255, 255, 255, 0.8)';
        c.fill();

        c.fillStyle = 'rgba(0, 0, 0, 0.7)';
        c.font = 'bold 14px Arial';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        
        if (this.type === 'machineGun') {
            c.fillText('⚡', this.position.x, this.position.y);
        } else if (this.type === 'shield') {
            c.fillText('🛡', this.position.x, this.position.y);
        }

        c.restore();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}