function randomBetween(min,max){
    return Math.random()*(max-min)+min;
}

function rectangularCollision({rectangle1,rectangle2}){
    return (
        rectangle1.position.y+rectangle1.height>=rectangle2.position.y &&
        rectangle1.position.y<=rectangle2.position.y+rectangle2.height &&
        rectangle1.position.x+rectangle1.width>=rectangle2.position.x &&
        rectangle1.position.x<=rectangle2.position.x+rectangle2.width
    )
}

function createScoreLabel({ object, score }) {
    hitLabels.push({
        x: object.position.x + object.width / 2,
        y: object.position.y + object.height / 2,
        value: score,
        alpha: 1,
        life: 45
    });
}

function createParticles({object,color,fades}){
    for(let i=0;i<15;i++){
        particles.push(
            new Particle({
                position:{
                    x:object.position.x+object.width/2,
                    y:object.position.y+object.height/2
                },
                velocity:{
                    x:(Math.random()-0.5)*2,
                    y:(Math.random()-0.5)*2
                },
                radius:Math.random()*3,
                color:color || '#BAA0DE',
                fades
            })
        )
    }
}