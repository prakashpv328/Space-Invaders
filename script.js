const scoreEl=document.querySelector('#scoreEl');
const canvas=document.querySelector("canvas");
const c=canvas.getContext("2d");

const settingsButton=document.querySelector('#settingsButton');
const settingsPopup=document.querySelector('#settingsPopup');
const settingsSave = document.querySelector('#settingsSave');
const settingsCancel = document.querySelector('#settingsCancel');
const shipOptions = document.querySelectorAll('.shipOption');

const startButton=document.querySelector('#startButton');
const restartButton=document.querySelector('#restartButton');
const backToLobbyButton=document.querySelector('#backToLobbyButton')
const startScreen=document.querySelector('#startScreen');
const restartScreen=document.querySelector('#restartScreen');
const scoreContainer=document.querySelector('#scoreContainer');

const pauseToggleBtn=document.querySelector('#pauseToggleBtn');
const pauseToggleIcon=document.querySelector('#pauseToggleIcon');

const soundOptions=document.querySelectorAll('.soundOption');

const powerUpTimersContainer=document.querySelector('#powerUpTimers');

const shieldTimerEl=document.querySelector('#shieldTimer');
const machineGunTimerEl=document.querySelector('#machineGunTimer');
const splitFireTimerEl=document.querySelector('#splitFireTimer');

const shieldTimerBar=shieldTimerEl?.querySelector('.timerFill');
const shieldTimerText=shieldTimerEl?.querySelector('.timerText');
const machineGunTimerBar=machineGunTimerEl?.querySelector('.timerFill');
const machineGunTimerText=machineGunTimerEl?.querySelector('.timerText');
const splitFireTimerBar=splitFireTimerEl?.querySelector('.timerFill');
const splitFireTimerText=splitFireTimerEl?.querySelector('.timerText');

const GAME_WIDTH=1250;
const GAME_HEIGHT=700;

let player=null;
let particles=[];
let projectiles=[];
let grids=[];
let invaderProjectiles=[];
let bombs=[];
let powerUps=[];
let score=0;
let hitLabels=[];

let keys={
    left:{pressed:false},
    right:{pressed:false},
    space:{pressed:false}
}

let levelSystem={
    currentLevel:1,
    maxLevel:5,
    levelComplete:false,
    showingTransition:false,
    allLevelsComplete:false,
    groupsCleared:0,
    totalGroupsForLevel:0
}

const LEVEL_CONFIG={
    1:{
        shootingFrequency:100,
        bonusPoints:500,
        totalGroups:1
    },
    2:{
        shootingFrequency:80,
        bonusPoints:750,
        totalGroups:1
    },
    3:{
        shootingFrequency:60,
        bonusPoints:1000,
        totalGroups:1
    },
    4:{
        shootingFrequency:50,
        bonusPoints:1500,
        totalGroups:1
    },
    5:{
        shootingFrequency:40,
        bonusPoints:2000,
        totalGroups:1
    }

}

let game={
    over:false,
    active:true
}

let frames=0;
let spawnBufferms=2200;
let nextGridSpawnTime=0;
const MIN_GRID_GAP_MS=1200;

let fps=60;
let fpsInterval=1000/fps;
let msPrev=window.performance.now();

const BULLET_SPEED={
    red:-8.5,
    yellow:-12,
    pink:-10
}

const FIRE_RATE={
    red:65,
    yellow:40,
    pink:55
}

let lastShotTime = {
    red: 0,
    yellow: 0,
    pink: 0
}

let isPaused=false;

let tempSelectedShip = localStorage.getItem('selectedShip') || './img/spaceships/spaceship1.png';

const storedSoundEnabled=localStorage.getItem('soundEnabled');
let tempSoundEnabled=storedSoundEnabled===null?true:storedSoundEnabled==='true';

function updatePowerUpTimers(){
    if(!player) return;

    const MAX_TIMER=60*6;

    if(player.shieldActive && player.shieldTimer>0){
        const remainingSeconds=Math.ceil(player.shieldTimer/60);
        const percentage=(player.shieldTimer/MAX_TIMER)*100;

        shieldTimerEl?.classList.remove('hidden');
        if(shieldTimerBar) shieldTimerBar.style.width=`${percentage}%`;
        if(shieldTimerText) shieldTimerText.textContent=`${remainingSeconds}s`;
    }
    else{
        shieldTimerEl?.classList.add('hidden');
    }


    if (player.powerUp === 'MachineGun' && player.powerUpTimer > 0) {
        const remainingSeconds=Math.ceil(player.powerUpTimer / 60);
        const percentage=(player.powerUpTimer / MAX_TIMER) * 100;
        
        machineGunTimerEl?.classList.remove('hidden');
        if (machineGunTimerBar) machineGunTimerBar.style.width = `${percentage}%`;
        if (machineGunTimerText) machineGunTimerText.textContent=`${remainingSeconds}s`;
    } else {
        machineGunTimerEl?.classList.add('hidden');
    }

    if(player.powerUp==='SplitFire' && player.splitFireActive && player.splitFireTimer>0){
        const remainingSeconds=Math.ceil(player.splitFireTimer/60);
        const percentage=(player.splitFireTimer/MAX_TIMER)*100;

        splitFireTimerEl?.classList.remove('hidden');
        if(splitFireTimerBar) splitFireTimerBar.style.width=`${percentage}%`;
        if(splitFireTimerText) splitFireTimerText.textContent=`${remainingSeconds}s`;
    }
    else{
        splitFireTimerEl?.classList.add('hidden');
    }

    const anyTimerActive = (player.shieldActive && player.shieldTimer > 0) || 
                          (player.powerUp === 'MachineGun' && player.powerUpTimer > 0) ||
                          (player.powerUp === 'SplitFire' && player.splitFireTimer > 0);
    
    if (powerUpTimersContainer) {
        powerUpTimersContainer.style.display = anyTimerActive ? 'flex' : 'none';
    }

}

function markSelected(shipPath) {
    shipOptions.forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.ship === shipPath);
    });
}

settingsButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    tempSelectedShip = localStorage.getItem('selectedShip') || './img/spaceships/spaceship1.png';
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

        if(grids.length===0 && !levelSystem.showingTransition){
            levelSystem.groupsCleared++;
            checkLevelCompletion();
        }

        return;
    }

    const positionedInvaders=grid.invaders.filter((invader)=>invader?.position)

    if(positionedInvaders.length===0) return;

    const firstInvader=positionedInvaders[0]
    const lastInvader=positionedInvaders[positionedInvaders.length-1]

    grid.width=lastInvader.position.x-firstInvader.position.x+lastInvader.width;
    grid.position.x=firstInvader.position.x;
}

function checkLevelCompletion(){
    const allgroupsCleared=levelSystem.groupsCleared>=levelSystem.totalGroupsForLevel;

    if(allgroupsCleared && !levelSystem.levelComplete && !levelSystem.showingTransition){
        levelSystem.levelComplete=true;
        showLevelTransition();
    }
}

function showLevelTransition(){
    if(levelSystem.showingTransition) return;

    levelSystem.showingTransition=true;

    const config=LEVEL_CONFIG[levelSystem.currentLevel];
    const bonusPoints=config.bonusPoints;

    score+=bonusPoints;
    scoreEl.innerHTML=score;

    audio.bonus.play();

    if(levelSystem.currentLevel>=levelSystem.maxLevel){
        showVictoryScreen();
        return;
    }

    const transitionEndTime=performance.now()+3000;

    function showTransition(){
        if(!game.active) return;

        const now=performance.now();
        const timeLeft=transitionEndTime-now;

        if(timeLeft>0){
            c.fillStyle="black";
            c.fillRect(0,0,canvas.width,canvas.height);

            drawLevelTransition(bonusPoints);

            requestAnimationFrame(showTransition);

        }
        else{
            levelSystem.currentLevel++;
            levelSystem.levelComplete=false;
            levelSystem.showingTransition=false;
            levelSystem.groupsCleared=0;
            levelSystem.totalGroupsForLevel=LEVEL_CONFIG[levelSystem.currentLevel].totalGroups;

            grids=[];
            invaderProjectiles=[];
            projectiles=[];
            bombs=[];
            powerUps=[];

            const now=performance.now();
            nextGridSpawnTime=now+1000;

            animate();
        }
    }
    showTransition();
}

function showVictoryScreen(){
    if(levelSystem.allLevelsComplete) return;

    levelSystem.allLevelsComplete = true;

    game.active = false;
    pauseToggleBtn.style.display = "none";

    if(powerUpTimersContainer)
        powerUpTimersContainer.style.display = "none";

    const victoryRestartScreen = document.createElement('div');
    victoryRestartScreen.id = 'victoryRestartScreen';

    victoryRestartScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.9);
        z-index: 1000;
    `;

    victoryRestartScreen.innerHTML = `
                <h1 style="color: #FFD700; font-size: 4rem; margin-bottom: 20px; text-shadow: 0 0 20px #FFD700;">
                    🎉 VICTORY! 🎉
                </h1>
                <p style="color: white; font-size: 2rem; margin-bottom: 30px;">
                    All Levels Completed!
                </p>
                <p style="color: #FFD700; font-size: 2.5rem; margin-bottom: 40px;">
                    Final Score: ${score}
                </p>
                <button id="victoryPlayAgain" style="
                    padding: 15px 40px;
                    font-size: 1.5rem;
                    background: linear-gradient(45deg, #FFD700, #FFA500);
                    border: none;
                    border-radius: 10px;
                    color: black;
                    cursor: pointer;
                    margin: 10px;
                    font-weight: bold;
                ">Play Again</button>
                <button id="victoryBackToLobby" style="
                    padding: 15px 40px;
                    font-size: 1.5rem;
                    background: rgba(255, 255, 255, 0.2);
                    border: 2px solid white;
                    border-radius: 10px;
                    color: white;
                    cursor: pointer;
                    margin: 10px;
                ">Main Menu</button>
            `;

    document.body.appendChild(victoryRestartScreen);

    document.getElementById('victoryPlayAgain').onclick = () => {
        victoryRestartScreen.remove();
        restartGame();
    };

    document.getElementById('victoryBackToLobby').onclick = () => {
        victoryRestartScreen.remove();
        goToLobby();
    };
}

function drawLevelTransition(bonusPoints){

    c.fillStyle = 'rgba(0, 0, 0, 0.85)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    c.fillStyle = '#FFD700';
    c.font = 'bold 60px Arial';
    c.textAlign = 'center';
    c.fillText('LEVEL ' + levelSystem.currentLevel + ' COMPLETE!', canvas.width / 2, canvas.height / 2 - 80);

    c.fillStyle = '#00FF00';
    c.font = 'bold 40px Arial';
    c.fillText('BONUS: +' + bonusPoints + ' POINTS', canvas.width / 2, canvas.height / 2 + 20);
    
    const nextLevel = levelSystem.currentLevel + 1;
    const nextConfig = LEVEL_CONFIG[nextLevel];
    if (nextConfig) {
        c.font = '24px Arial';
        c.fillStyle = '#CCCCCC';
        c.fillText(nextConfig.totalGroups + ' groups of enemies incoming...', canvas.width / 2, canvas.height / 2 + 105);
    }

}

// function drawVictoryScreen(){

//     c.fillStyle = 'rgba(0, 0, 0, 0.9)';
//     c.fillRect(0, 0, canvas.width, canvas.height);
    
//     c.shadowColor = '#FFD700';
//     c.shadowBlur = 20;
//     c.fillStyle = '#FFD700';
//     c.font = 'bold 80px Arial';
//     c.textAlign = 'center';
//     c.fillText('🎉 VICTORY! 🎉', canvas.width / 2, canvas.height / 2 - 100);

//     c.shadowBlur = 0;
    
//     c.fillStyle = 'white';
//     c.font = 'bold 40px Arial';
//     c.fillText('All 5 Levels Completed!', canvas.width / 2, canvas.height / 2 - 20);
    
//     c.fillStyle = '#FFD700';
//     c.font = 'bold 50px Arial';
//     c.fillText('Final Score: ' + score, canvas.width / 2, canvas.height / 2 + 40);
    
//     c.fillStyle = '#CCCCCC';
//     c.font = '28px Arial';
//     c.fillText('You are a true Space Defender!', canvas.width / 2, canvas.height / 2 + 100);
// }

function drawLevelIndicator() {
    c.fillStyle = 'white';
    c.font = 'bold 24px Arial';
    c.textAlign = 'right';
    c.fillText('Level ' + levelSystem.currentLevel , canvas.width - 20, 30);
}


function startGame(){
    audio.backgroundMusic.play();
    audio.start.play();

    startScreen.style.display="none";
    restartScreen.style.display="none";
    scoreContainer.style.display="block";
    pauseToggleBtn.style.display="block";

    isPaused=false;
    syncPauseIcon();

    init();
    animate();
}

function restartGame(){
    audio.select.play();
    audio.backgroundMusic.play();

    restartScreen.style.display="none";
    scoreContainer.style.display="block";
    pauseToggleBtn.style.display="block";

    isPaused=false;
    syncPauseIcon();

    init();
    animate();
}

function goToLobby(){
    audio.select.play();

    game.active=false;
    game.over=false;
    isPaused=false;

    restartScreen.style.display="none";
    scoreContainer.style.display="none";
    startScreen.style.display="flex";
    pauseToggleBtn.style.display="none";

    if(powerUpTimersContainer)
        powerUpTimersContainer.style.display="none";

    syncPauseIcon();
}

startButton?.addEventListener("click",startGame);
restartButton?.addEventListener("click",restartGame);
backToLobbyButton?.addEventListener("click",goToLobby);

function syncPauseIcon(){
    if(!pauseToggleIcon) return;

    if(isPaused){
        pauseToggleIcon.src="./img/components/play.png";
        pauseToggleIcon.alt="Play";
        pauseToggleBtn?.setAttribute('aria-label','Play');
    }
    else{
        pauseToggleIcon.src="./img/components/pause.png";
        pauseToggleIcon.alt="Pause";
        pauseToggleBtn?.setAttribute('aria-label','Pause');
    }
}

function pauseGame(){
    if(!game.active || game.over || isPaused || levelSystem.showingTransition) return;

    isPaused=true;
    audio.backgroundMusic.pause();
    syncPauseIcon();
}

function resumeGame(){
    if(!game.active || game.over || !isPaused) return;

    isPaused=false;
    audio.backgroundMusic.play();
    syncPauseIcon();
}

function togglePause(){
    if(!game.active || game.over) return;

    if(isPaused) resumeGame();
    else pauseGame();
}

pauseToggleBtn?.addEventListener("click",togglePause);

function init(){
    player=new Player();
    particles=[];
    projectiles=[];
    invaderProjectiles=[];
    grids=[];
    bombs=[];
    powerUps=[];
    score=0;
    hitLabels=[];
    scoreEl.innerHTML=score;

    levelSystem={
        currentLevel:1,
        maxLevel:5,
        levelComplete:false,
        showingTransition:false,
        allLevelsComplete:false,
        groupsCleared:0,
        totalGroupsForLevel:LEVEL_CONFIG[1].totalGroups
    }

    keys={
        left:{pressed:false},
        right:{pressed:false},
        space:{pressed:false}
    }

    
    frames=0;
    spawnBufferMs=2200;
    const now=performance.now();

    //invaders span
    nextGridSpawnTime=now+1000;

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
    isPaused=false;
    pauseToggleBtn.style.display="none";

    if(powerUpTimersContainer)
        powerUpTimersContainer.style.display="none";

    syncPauseIcon();

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

function resizeCanvas(){
    canvas.width=GAME_WIDTH;
    canvas.height=GAME_HEIGHT;
}

resizeCanvas();
window.addEventListener("resize",resizeCanvas);


function animate(){
    if(!game.active) return;

    requestAnimationFrame(animate);

    if(isPaused) return;

    const msNow=window.performance.now();
    const elapsed=msNow-msPrev;

    if(elapsed<fpsInterval) {
        return;
    }
    msPrev=msNow-(elapsed % fpsInterval);

    if(levelSystem.showingTransition) {
        requestAnimationFrame(animate);
        return;
    }


    c.fillStyle="black";
    c.fillRect(0,0,canvas.width,canvas.height);

    drawLevelIndicator();

    updatePowerUpTimers();

    for(let i=hitLabels.length-1;i>=0;i--){
        const l=hitLabels[i];
        l.y-=0.6;
        l.life-=1;
        l.alpha-=0.02;

        c.save();
        c.globalAlpha=Math.max(l.alpha,0);
        c.fillStyle='white';
        c.font='18px Arial';
        c.textAlign='center';
        c.fillText(String(l.value),l.x,l.y);
        c.restore();

        if(l.life<=0 || l.alpha<=0){
            hitLabels.splice(i,1);
        }
    }

    if(frames%800===0){
        powerUps.push(
            new PowerUp({
                position:{
                    x:0,
                    y:Math.random()*300+15
                },
                velocity:{
                    x:5,
                    y:0
                },
                type:'random'
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

            if(player.shieldActive && player.shieldTimer>0){
                invaderProjectiles.splice(i,1);

                createParticles({
                    object:{
                        position:{
                            x:invaderProjectile.position.x,
                            y:invaderProjectile.position.y
                        },
                        width:10,
                        height:10
                    },
                    color:'cyan',
                    fades:true
                });
            }
            else{
                invaderProjectiles.splice(i,1);
                endGame();
            }
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
                
                if(powerUp.type==='machineGun'){
                    player.activateMachineGun();
                }
                else if(powerUp.type==='shield'){
                    player.activateShield();
                }
                else if(powerUp.type==='splitFire'){
                    player.activateSplitFire();
                }

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

        const config = LEVEL_CONFIG[levelSystem.currentLevel];
        const shootingFrequency = config.shootingFrequency;

        if (frames % shootingFrequency === 0 && grid.invaders.length > 0) {
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
                        fades:true,
                        color:'orange'
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
                        fades:true,
                        color:invader.particleColor
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
                if(player.shieldActive && player.shieldTimer>0){
                    grid.invaders.splice(i,1);

                    createParticles({
                        object:invader,
                        fades:true,
                        color:'cyan'
                    });
                }
                else{
                    endGame();
                }
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

    const nowTime=performance.now();

        if(!levelSystem.showingTransition && nowTime>=nextGridSpawnTime){
 
            if(grids.length === 0 && levelSystem.groupsCleared < levelSystem.totalGroupsForLevel) {
                grids.push(new Grid());
                
                spawnBufferMs=Math.max(MIN_GRID_GAP_MS,spawnBufferMs-50);
                const delay=Math.max(
                    MIN_GRID_GAP_MS,
                    spawnBufferMs+Math.random()*700
                );
                nextGridSpawnTime=nowTime+delay;
            }
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

    if(
        keys.space.pressed &&
        player?.powerUp==='SplitFire' &&
        player?.splitFireActive &&
        !game.over &&
        player?.image &&
        now-lastShotTime.pink>=FIRE_RATE.pink
    ){
        lastShotTime.pink=now;
        audio.shoot.play();

        const centerX=player.position.x+player.width/2;
        const centerY=player.position.y;
        const speed=Math.abs(BULLET_SPEED.pink);

        projectiles.push(
            new Projectile({
                position:{x:centerX,y:centerY},
                velocity:{x:0,y:-speed},
                color:'#ff1493'
            })
        )

        const angle60=(90-70)*Math.PI/180;
        projectiles.push(
            new Projectile({
                position:{x:centerX,y:centerY},
                velocity:{
                    x:-Math.sin(angle60)*speed,
                    y:-Math.cos(angle60)*speed
                },
                color:'#ff1493'
            })
        );

        const angle120=(120-100)*Math.PI/180;

        projectiles.push(
            new Projectile({
                position:{x:centerX,y:centerY},
                velocity:{
                    x:Math.sin(angle120)*speed,
                    y:-Math.cos(angle120)*speed
                },
                color:'#ff1493'
            })
        );
    }

    frames++;
    requestAnimationFrame(animate);
}


// document.querySelector('#startButton').addEventListener("click",()=>{
//     audio.backgroundMusic.play();
//     audio.start.play();

//     document.querySelector('#startScreen').style.display="none";
//     document.querySelector("#scoreContainer").style.display="block";
//     init();
//     animate();


addEventListener("keydown",({key})=>{

    if(key==='Enter'){

        const isStartVisible=startScreen && getComputedStyle(startScreen).display!=='none';
        const isRestartVisible=restartScreen && getComputedStyle(restartScreen).display!=='none';

        if(isStartVisible){
            startButton?.click();
            return;
        }

        if(isRestartVisible){
            restartButton?.click();
            return;
        }
    }

    if(key==='Escape'){
        const isRestartVisible=restartScreen && getComputedStyle(restartScreen).display!=='none';
        if(isRestartVisible){
            goToLobby();
            return;
        }
    }

    if(key==='p' || key==='P'){
        togglePause();
        return;
    }

    if(game.over) return;

    switch(key){
        case 'a':
        case 'A':
        case 'ArrowLeft':
            keys.left.pressed=true;
            break;

        case 'd':
        case 'D':
        case 'ArrowRight':
            keys.right.pressed=true;
            break;


        case 'w':
        case 'W':
        case ' ':
        case 'ArrowUp':
            keys.space.pressed=true;

            const now = performance.now()

            if(player?.powerUp === 'MachineGun') return;
            if(player?.powerUp === 'SplitFire' && player?.splitFireActive) return;

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
        case 'A':
        case 'ArrowLeft':
            keys.left.pressed=false;
            break;

        case 'd':
        case 'D':
        case 'ArrowRight':
            keys.right.pressed=false;
            break;

        case 'w':
        case 'W':
        case 'ArrowUp':
        case ' ':
            keys.space.pressed=false;
            break;
    }
})