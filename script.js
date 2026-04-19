const scoreEl=document.querySelector('#scoreEl');
const scoreContainer=document.querySelector('#scoreContainer');

const canvas=document.querySelector("canvas");
const c=canvas.getContext("2d");

canvas.width=1024;
canvas.height=576;

let score=0;
scoreEl.textContent=score;

scoreContainer.classList.add('score--hidden');

function animate(){
    requestAnimationFrame(animate)
    c.fillStyle="black";
    c.fillRect(0,0,canvas.width,canvas.height);
}

animate()