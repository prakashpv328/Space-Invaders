const scoreEl=document.querySelector('#scoreEl');
const canvas=document.querySelector("canvas");
const c=canvas.getContext("2d");

canvas.width=1024;
canvas.height=576;

let player=null;
let particles=[];
let projectiles=[];
let score=0;

let keys={
    left:{passed:false},
    right:{pressed:false},
    space:{pressed:false}
}

let game={
    over:false,
    active:true
}

let fps=60;
let fpsInterval=1000/fps;
let msPrev=window.performance.now();

function init(){
    player=new Player();
    particles=[];
    projectiles=[];
    score=0;
    scoreEl.innerHTML=score;

    keys={
        left:{passed:false},
        right:{pressed:false},
        space:{pressed:false}
    }


    game={
        over:false,
        active:true
    }

    for(let i=0;i<100;i++){
        particles.push(
            new Particle({
                position:{
                    x:Math.random()*canvas.width,
                    y:Math.random()*canvas.height
                 },
                 velocity:{
                    x:0,
                    y:0.3
                },
                radius:Math.random()*2,
                color:'white'
            })
        )
    }
    scoreEl.innerHTML=0;
}


function animate(){
    if(!game.active) return;
    requestAnimationFrame(animate);

    const msNow=window.performance.now();
    const elapsed=msNow-msPrev;

    if(elapsed<fpsInterval) {
        return;
    }
    msPrev=msNow-(elapsed % fpsInterval);

    c.fillStyle="black";
    c.fillRect(0,0,canvas.width,canvas.height);

    for(const particle of particles){
        if(particle.position.y-particle.radius >= canvas.height){
            particle.position.x=Math.random()*canvas.width;
            particle.position.y=-particle.radius;
        } 
        particle.update();
    }

    for(let i=projectiles.length-1;i>=0;i--){
        const projectile=projectiles[i];

        if(projectile.position.y+projectile.radius<=0){
            projectiles.splice(i,1);
        }
        else{
            projectile.update();
        }
    }

    if(player){
        if(keys.left.pressed && player.position.x>=0){
            player.velocity.x=-7
            player.rotation=-0.15;
        }
        else if(keys.right.pressed && player.position.x+player.width<=canvas.width){
            player.velocity.x=7;
            player.rotation=0.15;
        }
        else{
            player.velocity.x=0;
            player.rotation=0;
        }
        player.update();
    }

}

document.querySelector('#startButton').addEventListener("click",()=>{
    document.querySelector('#startScreen').style.display="none";
    document.querySelector("#scoreContainer").style.display="block";
    init();
    animate();
})

document.querySelector("#restartButton").addEventListener("click",()=>{
    document.querySelector("#restartScreen").style.display="none";
    init();
    animate();
})

addEventListener("keydown",({key})=>{
    if(game.over) return;

    switch(key){
        case 'a':
        case 'ArrowLeft':
            keys.left.pressed=true;
            break;

        case 'd':
        case 'ArrowRight':
            keys.right.pressed=true;
            break;

        case ' ':

        if(!keys.space.pressed && player?.image){
            projectiles.push(
                new Projectile({
                    position:{
                        x:player.position.x+player.width/2,
                        y:player.position.y
                    },
                    velocity:{
                        x:0,
                        y:-10
                    }
                })
            )
        }
            keys.space.pressed=true;
            break;
    }
})

addEventListener("keyup",({key})=>{
    if(game.over) return;

    switch(key){
        case 'a':
        case 'ArrowLeft':
            keys.left.pressed=false;
            break;

        case 'd':
        case 'ArrowRight':
            keys.right.pressed=false;
            break;

        case ' ':
            keys.space.pressed=false;
            break;
    }
})