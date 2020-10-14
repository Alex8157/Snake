const WIDTH = 480;
const HEIGHT = 480;
const CENTER = 240;
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
        100);
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
        this.picture.draw("#cfcfcf", 0, 0, WIDTH, HEIGHT) // рисуем игровое поле
        this.serpent.move();
        this.drawSnake(this.serpent);
    }

    drawSnake() {
        for (let i = 0; i < this.serpent.cellsNumber; i++) {
            let cellParams = this.serpent.cells[i].getInfo()
            this.picture.draw(cellParams.color, cellParams.x, cellParams.y, cellParams.width, cellParams.height)
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
        this.moveCounter = 0;
        this.cellsNumber = LENGTHSNAKE;
        this.cells = [];
        for (let i = 0; i < LENGTHSNAKE; i++) {
            this.cells.push(new square("#000", CENTER,CENTER+i*SIDE,SIDE,SIDE))
        }
        this.direction = directions.forward;
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
        for (let i = this.cellsNumber - 1; i > 0; i--) {
            this.cells[i].changeCoordinates(this.cells[i-1].getCoordinatesX(),this.cells[i-1].getCoordinatesY())
        }
        switch (this.direction) {
            case directions.forward:
                this.cells[0].changeCoordinates(this.cells[0].getCoordinatesX(), this.cells[0].getCoordinatesY() - 10)
                break;
            case directions.right:
                this.cells[0].changeCoordinates(this.cells[0].getCoordinatesX() + 10, this.cells[0].getCoordinatesY())
                break;
            case directions.back:
                this.cells[0].changeCoordinates(this.cells[0].getCoordinatesX(), this.cells[0].getCoordinatesY() + 10)
                break;
            case directions.left:
                this.cells[0].changeCoordinates(this.cells[0].getCoordinatesX() - 10, this.cells[0].getCoordinatesY())
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
            this.cells[0].getCoordinatesX() == WIDTH || this.cells[0].getCoordinatesY() == HEIGHT) {
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
}