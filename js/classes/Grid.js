    class Grid{
        constructor(){
            this.position={
                x:0,
                y:0
            }

            this.velocity={
                x:3,
                y:0
            }

            this.invaders=[];

            const spaceX=50;

            const minRow=2;
            const maxRow=6;
            const minCol=5;
            const maxCol=10;

            const columns=Math.floor(Math.random() * (maxCol-minCol+1)+minCol);
            const rows=Math.floor(Math.random() * (maxRow-minRow+1)+minRow);

            this.width=columns*spaceX;

            for(let x=0;x<columns;x++){
                for(let y=0;y<rows;y++){
                    this.invaders.push(
                        new Invader({
                            position:{
                                x:x*spaceX,
                                y:y*32
                            }
                        })
                    )
                }
            }
        }

        update(){
            this.position.x+=this.velocity.x
            this.position.y+=this.velocity.y

            this.velocity.y=0

            if(this.position.x+this.width>=canvas.width || this.position.x<=0){
                this.velocity.x=-this.velocity.x*1.15;
                this.velocity.y=30
            }
        }
    }