const scoreEl=document.querySelector('#scoreEl');
const canvas=document.querySelector("canvas");
const c=canvas.getContext("2d");

const settingsButton=document.querySelector('#settingsButton');
const settingsPopup=document.querySelector('#settingsPopup');
const settingsSave = document.querySelector('#settingsSave');
const settingsCancel = document.querySelector('#settingsCancel');
const shipOptions = document.querySelectorAll('.shipOption');

const soundOptions=document.querySelectorAll('.soundOption');

canvas.width=1250;
canvas.height=700;

let player=null;
let particles=[];
let projectiles=[];
let grids=[];
let invaderProjectiles=[];
let bombs=[];
let powerUps=[];
let score=0;

let keys={
    left:{pressed:false},
    right:{pressed:false},
    space:{pressed:false}
}

let frames=0;
let randomInterval=Math.floor(Math.random()*500+500);

let game={
    over:false,
    active:true
}

let spawnBuffer=500;

let fps=60;
let fpsInterval=1000/fps;
let msPrev=window.performance.now();

const BULLET_SPEED={
    red:-8.5,
    yellow:-12
}

const FIRE_RATE={
    red:65,
    yellow:40
}

let lastShotTime = {
  red: 0,
  yellow: 0
}

let tempSelectedShip = localStorage.getItem('selectedShip') || './img/spaceship.png';

const storedSoundEnabled=localStorage.getItem('soundEnabled');
let tempSoundEnabled=storedSoundEnabled===null?true:storedSoundEnabled==='true';

function markSelected(shipPath) {
  shipOptions.forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.ship === shipPath);
  });
}

settingsButton?.addEventListener('click', (e) => {
  e.stopPropagation();
  tempSelectedShip = localStorage.getItem('selectedShip') || './img/spaceship.png';
  markSelected(tempSelectedShip);
  tempSoundEnabled = storedSoundEnabled === null ? true : storedSoundEnabled === 'true';
  markSoundSelected(tempSoundEnabled);
  settingsPopup?.classList.remove('hidden');
});

shipOptions.forEach(btn => {
  btn.addEventListener('click', () => {
    tempSelectedShip = btn.dataset.ship;
    markSelected(tempSelectedShip);
  });
});

soundOptions.forEach(btn => {
  btn.addEventListener('click', () => {
    tempSoundEnabled = btn.dataset.sound === 'on';
    markSoundSelected(tempSoundEnabled);
  });
});

settingsCancel?.addEventListener('click', () => {
  settingsPopup?.classList.add('hidden');
});

settingsSave?.addEventListener('click', () => {
  localStorage.setItem('selectedShip', tempSelectedShip);
  localStorage.setItem('soundEnabled', tempSoundEnabled);
  applySoundSetting(tempSoundEnabled);
  settingsPopup?.classList.add('hidden');
});

settingsPopup?.addEventListener('click', (e) => {
  if (e.target === settingsPopup) settingsPopup.classList.add('hidden');
});

function markSoundSelected(isEnabled){
    soundOptions.forEach(btn=>{
        const isOnButton=btn.dataset.sound==='on';
        btn.classList.toggle('selected',isOnButton===isEnabled)
    });
}

function applySoundSetting(isEnabled){
    Howler.mute(!isEnabled);
}

applySoundSetting(tempSoundEnabled);

function updateGridBounds(grid,gridindex){
    if(grid.invaders.length===0){
        grids.splice(gridindex,1);
        return;
    }

    const positionedInvaders=grid.invaders.filter((invader)=>invader?.position)

    if(positionedInvaders.length===0) return;

    const firstInvader=positionedInvaders[0]
    const lastInvader=positionedInvaders[positionedInvaders.length-1]

    grid.width=lastInvader.position.x-firstInvader.position.x+lastInvader.width;
    grid.position.x=firstInvader.position.x;
}

function init(){
    player=new Player();
    particles=[];
    projectiles=[];
    invaderProjectiles=[];
    grids=[];
    bombs=[];
    powerUps=[];
    score=0;
    scoreEl.innerHTML=score;

    keys={
        left:{pressed:false},
        right:{pressed:false},
        space:{pressed:false}
    }

    frames=0;
    randomInterval=Math.floor(Math.random()*500+500);
    spawnBuffer=500;

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
                radius:Math.random()*3,
                color:'white'
            })
        )
    }
}

function endGame(){
    if(game.over) return;

    console.log("lose");
    audio.gameOver.play();

    player.opacity=0;
    game.over=true;

    setTimeout(()=>{
        game.active=false;
        document.querySelector("#restartScreen").style.display="flex";
    },2000)


    createParticles({
        object:player,
        color:'white',
        fades:true
    })
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

    if(frames%500===0){
        powerUps.push(
            new PowerUp({
                position:{
                    x:0,
                    y:Math.random()*300+15
                },
                velocity:{
                    x:5,
                    y:0
                }
            })
        )
    }

    for(let i=powerUps.length-1;i>=0;i--){
        const powerUp=powerUps[i];
        if(powerUp.position.x-powerUp.radius>=canvas.width){
            powerUps.splice(i,1);
        }
        else{
            powerUp.update()
        }
    }

    if(frames%200===0 && bombs.length<3){
        bombs.push(
            new Bomb({
                position:{
                    x:randomBetween(Bomb.radius,canvas.width-Bomb.radius),
                    y:randomBetween(Bomb.radius,canvas.height-Bomb.radius)
                },
                velocity:{
                    x:(Math.random()-0.5)*6,
                    y:(Math.random()-0.5)*6
                }
            })
        )
    }

    for(let i=bombs.length-1;i>=0;i--){
        const bomb=bombs[i]
        if(bomb.opacity<=0) bombs.splice(i,1)
        else bomb.update();
    }


    for(let i=particles.length-1;i>=0;i--){
        const particle=particles[i];

        if(particle.position.y-particle.radius >= canvas.height){
            particle.position.x=Math.random()*canvas.width;
            particle.position.y=-particle.radius;
        } 

        if(particle.opacity<=0){
            particles.splice(i,1)
        }
        else{
            particle.update()
        }
    }

    if(player?.particles){
        for(let i=player.particles.length-1;i>=0;i--){
            const particle=player.particles[i]
            particle.update();

            if(particle.opacity<=0){
                player.particles.splice(i,1);
            }
        }
    }

    for(let i=invaderProjectiles.length-1;i>=0;i--){
        const invaderProjectile=invaderProjectiles[i]

        if(invaderProjectile.position.y+invaderProjectile.height>=canvas.height){
            invaderProjectiles.splice(i,1);
        }
        else{
            invaderProjectile.update();
        }

        if(player?.image && rectangularCollision({
            rectangle1:invaderProjectile,
            rectangle2:player
        }) && !game.over){
            invaderProjectiles.splice(i,1);
            endGame();
        }   
    }

    for(let i=projectiles.length-1;i>=0;i--){
        const projectile=projectiles[i];

        if(!projectile || !projectile.position) continue;

        for(let j=bombs.length-1;j>=0;j--){
            const bomb=bombs[j]
            if(
                Math.hypot(
                    projectile.position.x-bomb.position.x,
                    projectile.position.y-bomb.position.y
                ) < projectile.radius+bomb.radius && !bomb.active
            ){
                projectiles.splice(i,1);
                // score+=50;
                // scoreEl.innerHTML=score;

                // createScoreLabel({
                //     object:bomb,
                //     score:50
                // })

                bomb.explode()
                break;
            }
        }


        for(let j=powerUps.length-1;j>=0;j--){
            const powerUp=powerUps[j]
            if(
                Math.hypot(
                    projectile.position.x-powerUp.position.x,
                    projectile.position.y-powerUp.position.y
                ) < projectile.radius+powerUp.radius
            ){
                projectiles.splice(i,1);
                powerUps.splice(j,1);
                
                player.powerUp='MachineGun'
                audio.bonus.play();

                setTimeout(()=>{
                    if(player) player.powerUp=null;
                }, 5000)

                break;
            }
        }

        if(!projectiles[i]) continue;

        if(projectile.position.y+projectile.radius<=0){
            projectiles.splice(i,1);
        }
        else{
            projectile.update();
        }
    }

    grids.forEach((grid,gridindex)=>{
        grid.update();

        if (frames % 100 === 0 && grid.invaders.length > 0) {
            const randomInvader =
                grid.invaders[Math.floor(Math.random() * grid.invaders.length)]
            randomInvader.shoot(invaderProjectiles)
        }

        for(let i=grid.invaders.length-1;i>=0;i--){
            const invader=grid.invaders[i];
            if (!invader || !invader.position) continue;

            invader.update({velocity:grid.velocity})

            for(let j=bombs.length-1;j>=0;j--){
                const bomb=bombs[j]
                const invaderRadius=15

                if(
                    Math.hypot(
                        invader.position.x-bomb.position.x,
                        invader.position.y-bomb.position.y
                    ) < invaderRadius + bomb.radius && bomb.active
                ){
                    grid.invaders.splice(i,1);
                    score+=50
                    scoreEl.innerHTML=score;

                    createScoreLabel({
                        object:invader,
                        score:50
                    })

                    createParticles({
                        object:invader,
                        fades:true
                    })

                    updateGridBounds(grid,gridindex)
                    break;
                }
            }

            if(!grid.invaders[i]) continue;

            for(let j=projectiles.length-1;j>=0;j--){
                const projectile=projectiles[j]
                if(!projectile || !projectile.position) continue;

                if(projectile.position.y-projectile.radius<=invader.position.y+invader.height &&
                    projectile.position.x+projectile.radius>=invader.position.x &&
                    projectile.position.x-projectile.radius<=invader.position.x+invader.width &&
                    projectile.position.y+projectile.radius>=invader.position.y
                ){
                    grid.invaders.splice(i,1)
                    projectiles.splice(j,1)

                    score+=100;
                    scoreEl.innerHTML=score;

                    createScoreLabel({
                        object:invader,
                        score:100
                    })

                    createParticles({
                        object:invader,
                        fades:true
                    })

                    audio.explode.play();

                    updateGridBounds(grid,gridindex)
                    break;
                }
            }

            if(
            player?.image &&
            rectangularCollision({
                rectangle1:invader,
                rectangle2:player
            }) && !game.over)
            {
                endGame();
            }
        }
    })

    if(player && player.image && player.position){
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

    if(frames%randomInterval===0){
        spawnBuffer=spawnBuffer<0?100:spawnBuffer;
        grids.push(new Grid())
        randomInterval=Math.floor(Math.random()*500+spawnBuffer);
        frames=0;
        spawnBuffer-=100
    }

    const now = performance.now()

    if(
        keys.space.pressed && 
        player?.powerUp==='MachineGun' &&
        !game.over && 
        player?.image &&
        now - lastShotTime.yellow >= FIRE_RATE.yellow
    ){
        lastShotTime.yellow = now
        audio.shoot.play();

        projectiles.push(
            new Projectile({
                position:{
                    x:player.position.x+player.width/2,
                    y:player.position.y
                },
                velocity:{x:0,y:BULLET_SPEED.yellow},
                color:'yellow'
            })
        )
    }
    frames++;
}


document.querySelector('#startButton').addEventListener("click",()=>{
    audio.backgroundMusic.play();
    audio.start.play();

    document.querySelector('#startScreen').style.display="none";
    document.querySelector("#scoreContainer").style.display="block";
    init();
    animate();
})

document.querySelector("#restartButton").addEventListener("click",()=>{
    audio.select.play();
    
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
            keys.space.pressed=true;

            const now = performance.now()

            if(player?.powerUp === 'MachineGun') return;

            if(player?.image && now - lastShotTime.red >= FIRE_RATE.red)
            {
                lastShotTime.red = now

                audio.shoot.play();
                projectiles.push(
                    new Projectile({
                        position:{
                            x:player.position.x+player.width/2,
                            y:player.position.y
                        },
                        velocity:{x:0,y:BULLET_SPEED.red},
                        color:'red'
                    })
                )
            }
        break;
    }
})

addEventListener("keyup",({key})=>{
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