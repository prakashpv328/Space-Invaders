class Invader {
  constructor({ position }) {
    this.velocity = {
        x: 0,
        y: 0
    }

    this.image = null
    this.width = 0
    this.height = 0
    this.position = null

    const image = new Image()
    image.src = './img/invader.png'
    image.onload = () => {
        const scale = 1
        this.image = image
        this.width = image.width * scale
        this.height = image.height * scale
        this.position = {
            x: position.x,
            y: position.y
        }
    }
  }

  draw() {
    if (!this.image || !this.position) return

    c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
    )
  }

    update({ velocity }) {
        if (!this.image || !this.position) return

        this.draw()
        this.position.x += velocity.x
        this.position.y += velocity.y
    }

  shoot(invaderProjectiles){
    if(!this.position) return;

    invaderProjectiles.push(
        new InvaderProjectile({
            position:{
                x:this.position.x+this.width/2,
                y:this.position.y+this.height
            },
            velocity:{
                x:0,
                y:5
            }
        })
    )
  }
}