class Player{
    constructor(){
        this.velocity={x:0,y:0};
        this.rotation=0;
        this.opacity=1;
        this.powerUp=null;
        this.shieldActive=false;
        this.shieldTimer=0;
        this.shieldPulse=0;
        this.splitFireActive=false;
        this.splitFireTimer=0;


        const image=new Image();
        
        const selectedShip=localStorage.getItem('selectedShip') || './img/spaceships/spaceship1.png';
        image.src=selectedShip;

        image.onerror=()=>{
            image.src='./img/spaceships/spaceship1.png';
        }

        image.onload=()=>{
            const scale=0.15;
            this.image=image;
            this.width=image.width*scale;
            this.height=image.height*scale;
            this.position={
                x:canvas.width/2-this.width/2,
                y:canvas.height-this.height-20
            }
        }
        this.particles=[]
        this.frames=0;
        this.powerUpTimer=0;
    }

    activateShield(){
        this.shieldActive=true;
        this.shieldTimer=60*8;
        this.shieldPulse=0;
        audio.bonus.play();
    }
 
    activateMachineGun(){
        this.powerUp='MachineGun';
        this.powerUpTimer=60*8;
        audio.bonus.play();
    }

    activateSplitFire(){
        this.powerUp='SplitFire';
        this.splitFireActive=true;
        this.splitFireTimer=60*8;
        audio.bonus.play();
    }

    draw() {
        if(!this.image) return;

        c.save();
        c.globalAlpha=this.opacity;

        if(this.shieldActive && this.shieldTimer>0){
            this.drawShield();
        }

        c.translate(
            player.position.x+player.width/2,
            player.position.y+player.height/2
        )

        c.rotate(this.rotation)

        c.translate(
            -player.position.x-player.width/2,
            -player.position.y-player.height/2
        )

            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
            c.restore()
    }

    drawShield(){
        const centerX=this.position.x+this.width/2;
        const centerY=this.position.y+this.height/2;
        const radius=Math.max(this.width,this.height)*0.8;
 
        this.shieldPulse+=0.05;
        const pulse=Math.sin(this.shieldPulse)*5;

        const gradient=c.createRadialGradient(
            centerX,centerY,radius-10+pulse,
            centerX,centerY,radius+15+pulse
        );
        gradient.addColorStop(0,'rgba(0,170,255,0)');
        gradient.addColorStop(0.5,'rgba(0,170,255,0.4)');
        gradient.addColorStop(1,'rgba(0,170,255,0)');
 
        c.beginPath();
        c.arc(centerX,centerY,radius+15+pulse,0,Math.PI*2);
        c.fillStyle=gradient;
        c.fill();
 
        c.beginPath();
        c.arc(centerX,centerY,radius+pulse,0,Math.PI*2);
        c.strokeStyle='rgba(100,200,255,0.6)';
        c.lineWidth=3;
        c.stroke();
 
        c.beginPath();
        c.arc(centerX,centerY,radius-5+pulse,0,Math.PI*2);
        c.strokeStyle='rgba(150,220,255,0.8)';
        c.lineWidth=2;
        c.stroke();
    }

    update(){
        if(!this.image) return
        this.draw();
        this.position.x+=this.velocity.x;

        if(!isPaused){
            if(this.powerUp==='MachineGun' && this.powerUpTimer>0){
                this.powerUpTimer--;
                if(this.powerUpTimer<=0){
                    this.powerUp=null;
                    this.powerUpTimer=0;
                }
            }
 
            if(this.shieldActive && this.shieldTimer>0){
                this.shieldTimer--;
                if(this.shieldTimer<=0){
                    this.shieldActive=false;
                    this.shieldTimer=0;
                }
            }

            if(this.splitFireActive && this.splitFireTimer>0){
                this.splitFireTimer--;
                if(this.splitFireTimer<=0){
                    this.splitFireActive=false;
                    this.splitFireTimer=0;
                }
            }
        }

        if(this.opacity!==1) return;

        this.frames++

        if(this.frames%2===0){
            this.particles.push(
                new Particle({
                    position:{
                        x:this.position.x+this.width/2,
                        y:this.position.y+this.height
                    },
                    velocity:{
                        x:(Math.random()-0.5)*1.5,
                        y:1.5+Math.random()*1.5
                    },
                    radius:Math.random()*2,
                    color:this.shieldActive?'cyan':'white',
                    fades:true
                })
            )
        }
    }
}