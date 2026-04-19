function randomBetween(min,max){
    return Math.random()*(max-min)+min;
}

function rectangleCollision({rectangle1,rectngle2}){
    return (
        rectangle1.position.y+rectangle1.height>=rectangle2.position.y &&
        rectangle1.position.x+rectangle1.width>=rectangle2.position.x &&
        rectangle1.position.x<=rectangle1.position.x+rectangle2.width
    )
}