    class Grid{
        constructor(config={}){
            this.position={
                x:0,
                y:0
            }

            
            
            // const columns=Math.floor(Math.random() * (config.columns.max-config.columns.min+1)+config.columns.min);
            // const rows=Math.floor(Math.random() * (config.rows.max-config.rows.min+1)+config.rows.min);
            const rows = config.rows || Math.floor(Math.random() * (6-2+1)+2);
            const columns = config.columns || Math.floor(Math.random() * (10-5+1)+5);
            const speed=config.speed || 3;

            this.velocity={
                x:speed,
                y:0
            }
            
            this.invaders=[];

            const spaceX=50;

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