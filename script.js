const scoreEl=document.querySelector('#scoreEl');
const canvas=document.querySelector("canvas");
const c=canvas.getContext("2d");

canvas.width=1024;
canvas.height=576;

let score=0;
scoreEl.textContent=score;

let particles=[];
let game={
    over:false,
    active:true
}

let fps=60;
let fpsInterval=1000/fps;
let msPrev=window.performance.now();

function init(){
    particles=[];
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

    particles.forEach((particle)=>{
        if(particle.position.y-particle.radius >= canvas.height){
            particle.position.x=Math.random()*canvas.width;
            particle.position.y=-particle.radius;
        } 
        particle.update();
    })

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