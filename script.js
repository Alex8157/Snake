const SIDE = 30;
const WIDTH = SIDE*20;
const HEIGHT = SIDE*20;
const CENTER = (WIDTH + HEIGHT)/4;
const LENGTHSNAKE = 3;
const WIDTHLINE = 2;
const directions = { forward: 1, right: 2, back: 3, left:4 };

function play(){
    let game = new scene();
    game.play();
}

class painting {
    constructor() {
        this.canvas = document.getElementById("snake");
        this.canvas.width = WIDTH+WIDTHLINE;
        this.canvas.height = HEIGHT+WIDTHLINE;
        this.context = this.canvas.getContext('2d');
    }

    draw(color ,x, y, width, height) {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    }
    
    displayOfInformationAboutTheLoss() {
        this.draw("#055", 0, 0, WIDTH, HEIGHT)
        this.context.fillStyle = "#cfcfcf";
        this.context.font = "100px Arial";
        this.context.fillText("GAME", WIDTH/10, HEIGHT/3);
        this.context.fillText("OVER", WIDTH/10, HEIGHT*2/3);
    }

    playingField() {
        this.draw("#cfcfcf", 0, 0, WIDTH+WIDTHLINE, HEIGHT+WIDTHLINE);
        this.drawGrid()
    }

    drawGrid() {
        for (let i = 0; i < WIDTH/SIDE+WIDTHLINE; i++) {
            this.draw("#727573", i*SIDE, 0, WIDTHLINE, HEIGHT)
            this.draw("#727573", 0, i*SIDE, WIDTH, WIDTHLINE)
        }
    }
}

class scene {
    constructor() {
        this.picture = new painting();
        this.serpent = new snake();
        this.makeFood()
    }

    play() {
        this.startListener(this.serpent);
        this.interval = setInterval( () => { 
            if (this.serpent.cellsNumber != 0) {
                this.update()
            } 
            else {
                clearInterval(this.interval);
                this.picture.displayOfInformationAboutTheLoss() 
            } },
        250);
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
        this.picture.playingField(); // рисуем игровое поле
        this.drawFood();
        this.serpent.move();
        this.drawSnake(this.serpent);
    }

    drawSnake() {
        for (let i = 0; i < this.serpent.cellsNumber; i++) {
            let cellParams = this.serpent.cells[i].getInfo()
            this.picture.draw(
                cellParams.color,
                cellParams.x+WIDTHLINE,
                cellParams.y+WIDTHLINE,
                cellParams.width-WIDTHLINE,
                cellParams.height-WIDTHLINE)
        }
    }

    checkFood() {
        if (this.serpent.getHeadCoordinates().x == this.food.x && this.serpent.getHeadCoordinates().y == this.food.y) {
            this.serpent.eat();
            this.makeFood();
        }
    }

    makeFood() {
        this.food = new square("#f00", Math.floor((Math.random() * (WIDTH - 0) + 0)/SIDE)*SIDE, 
        Math.floor((Math.random() * (HEIGHT - 0) + 0)/SIDE)*SIDE, SIDE, SIDE)
    }

    drawFood() {
        this.picture.draw(
            this.food.getInfo().color,
            this.food.getInfo().x+WIDTHLINE,
            this.food.getInfo().y+WIDTHLINE,
            this.food.getInfo().width-WIDTHLINE,
            this.food.getInfo().height-WIDTHLINE
        );
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
        this.moveCounter = 0;
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
    if (this.moveCounter == 0) {
        this.moveCounter++;
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
}

    travel() {
        this.lastCell = {x: this.cells[this.cellsNumber - 1].getCoordinatesX(), y:this.cells[this.cellsNumber - 1].getCoordinatesY()}
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
        this.moveCounter = 0;
        this.travel();
        if (this.checkIntersection() != true || this.goOut() != true) {
            this.delete()
        }
    }

    goOut() {
        if (this.cells[0].getCoordinatesX() < 0 || this.cells[0].getCoordinatesY() < 0 ||
            this.cells[0].getCoordinatesX() >= WIDTH || this.cells[0].getCoordinatesY() >= HEIGHT) {
                return false;
        }
        else
            return true;
    }

    checkIntersection() {
        for (let i = 2; i < this.cellsNumber; i++) {
            if (this.cells[0].getCoordinatesX()== this.cells[i].getCoordinatesX() &&
                 this.cells[0].getCoordinatesY() == this.cells[i].getCoordinatesY()) { 
                    return false;
            }
        }
        return true;
    }

    eat(){
        this.hunger = false;
    }
}