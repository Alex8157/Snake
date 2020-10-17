const WIDTH = 480;
const HEIGHT = 480;
const CENTER = (WIDTH + HEIGHT)/4;
const SIDE = 10;
const LENGTHSNAKE = 3;
const directions = { forward: 1, right: 2, back: 3, left:4 };

function play(){
    let game = new scene();
    game.play();
}

class painting {
    constructor() {
        this.canvas = document.getElementById("snake");
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        this.context = this.canvas.getContext('2d');
    }

    draw(color ,x, y, width, height) {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    }
    
    lose() {
        this.draw("#055", 0, 0, WIDTH, HEIGHT)
        this.context.fillStyle = "#cfcfcf";
        this.context.font = "100px Arial";
        this.context.fillText("GAME", WIDTH/10, HEIGHT/3);
        this.context.fillText("OVER", WIDTH/10, HEIGHT*2/3);
    }
}

class scene {
    constructor() {
        this.picture = new painting();
        this.serpent = new snake();
        this.food = new square("#000", Math.round((Math.random() * (WIDTH - 0) + 0)/SIDE)*SIDE, 
        Math.round((Math.random() * (HEIGHT - 0) + 0)/SIDE)*SIDE, SIDE, SIDE);
    }

    play() {
        this.startListener(this.serpent);
        this.interval = setInterval( () => { 
            if (this.serpent.cellsNumber != 0) {
                this.update()
            } 
            else {
                clearInterval(this.interval);
                this.picture.lose() 
            } },
        500);
    }

    startListener(serpent) {
        document.addEventListener("keyup", function (event) {
            switch (event.key) {
                case "ArrowRight":
                    serpent.changeDirection(1);
                    break;
                case "ArrowLeft":
                    serpent.changeDirection(-1);
                    break;
                default:
                    break;
            }
        })
    }

    update() {
        this.checkFood();
        this.picture.draw("#cfcfcf", 0, 0, WIDTH, HEIGHT); // рисуем игровое поле
        this.picture.draw(this.food.getInfo().color,this.food.getInfo().x,this.food.getInfo().y,this.food.getInfo().width,this.food.getInfo().height);
        this.serpent.move();
        this.drawSnake(this.serpent);
    }

    drawSnake() {
        for (let i = 0; i < this.serpent.cellsNumber; i++) {
            let cellParams = this.serpent.cells[i].getInfo()
            this.picture.draw(cellParams.color, cellParams.x, cellParams.y, cellParams.width, cellParams.height)
        }
    }

    checkFood() {
        if (this.serpent.getHeadCoordinates().x == this.food.x && this.serpent.getHeadCoordinates().y == this.food.y) {
            this.serpent.eat();
            this.food = new square("#000", Math.round((Math.random() * (WIDTH - 0) + 0)/SIDE)*SIDE, 
            Math.round((Math.random() * (HEIGHT - 0) + 0)/SIDE)*SIDE, SIDE, SIDE);
        }
    }
}

class square {
    constructor(color, x, y, width, height) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    getInfo() {
        return {
            color: this.color,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }
    }

    getCoordinatesX() {
        return this.x
    }

    getCoordinatesY() {
        return this.y
    }

    changeCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }
}

class snake {
    constructor() {
        this.cellsNumber = LENGTHSNAKE;
        this.cells = [];
        this.hunger = true;
        for (let i = 0; i < LENGTHSNAKE; i++) {
            this.cells.push(new square("#000", Math.floor(CENTER/SIDE)*SIDE,Math.floor(CENTER/SIDE)*SIDE+i*SIDE,SIDE,SIDE))
        }
        this.direction = directions.forward;
    }

    getHeadCoordinates() {
        return {x:this.cells[0].getCoordinatesX(),y:this.cells[0].getCoordinatesY()}
    }
    
    delete() {
        for (let i = 0; i < LENGTHSNAKE; i++) {
            this.cells.pop()
        }
        this.cellsNumber = 0
    }

    changeDirection(newDirection) {
            this.direction = this.direction + newDirection;
            if((this.direction) > directions.left ){
                this.direction = directions.forward;
            }
            else {
                if(this.direction < directions.forward ){
                    this.direction = directions.left;
                }
            }
    }

    travel() {
        if (this.hunger == false) {
            this.lastCell = {x: this.cells[this.cellsNumber - 1].getCoordinatesX(), y:this.cells[this.cellsNumber - 1].getCoordinatesY()}
        }
        for (let i = this.cellsNumber - 1; i > 0; i--) {
            this.cells[i].changeCoordinates(this.cells[i-1].getCoordinatesX(),this.cells[i-1].getCoordinatesY())
        }
        this.headMovement();
        if (this.hunger == false) {
            this.cellsNumber++;
            this.cells.push(new square("#000", this.lastCell.x,this.lastCell.y,SIDE,SIDE));
            this.hunger = true;
        }
    }

    headMovement() {
        switch (this.direction) {
            case directions.forward:
                this.cells[0].changeCoordinates(this.cells[0].getCoordinatesX(), this.cells[0].getCoordinatesY() - SIDE)
                break;
            case directions.right:
                this.cells[0].changeCoordinates(this.cells[0].getCoordinatesX() + SIDE, this.cells[0].getCoordinatesY())
                break;
            case directions.back:
                this.cells[0].changeCoordinates(this.cells[0].getCoordinatesX(), this.cells[0].getCoordinatesY() + SIDE)
                break;
            case directions.left:
                this.cells[0].changeCoordinates(this.cells[0].getCoordinatesX() - SIDE, this.cells[0].getCoordinatesY())
                break;
        }
    }

    move() {
        this.travel();
        this.goOut();
    }

    goOut() {
        if (this.cells[0].getCoordinatesX() < 0 || this.cells[0].getCoordinatesY() < 0 ||
            this.cells[0].getCoordinatesX() > WIDTH || this.cells[0].getCoordinatesY() > HEIGHT) {
                this.delete()
        }
    }

    eat(){
        this.hunger = false;
    }
}