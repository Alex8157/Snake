const WIDTH = 480;
const HEIGHT = 480;
const CENTER = 240;
const SIDE = 10;
const LENGTHSNAKE = 3;

function play() {
    init();
    drawField();
    let x = new snake;
    x.drawSnake();
    setInterval( () => { update( x ) }, 1000);
}

function init() {
    canvas = document.getElementById("snake");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    context = canvas.getContext('2d');
}

function drawField() {
    context.fillStyle = "#cfcfcf";
    context.fillRect(0, 0, WIDTH, HEIGHT);
}

class square {
    constructor(color, x, y, width, height) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    drawSquare() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    returnCoordinatesX() {
        return this.x
    }

    returnCoordinatesY() {
        return this.y
    }

    coordinatesChange(x, y) {
        this.x = x;
        this.y = y;
    }
}

class snake {
    constructor() {
        this.cellsNumber = LENGTHSNAKE;
        this.cells = []
        for (let i = 0; i < LENGTHSNAKE; i++) {
            this.cells.push(new square("#000", CENTER,CENTER+i*SIDE,SIDE,SIDE))
        }
        const directions = { forward: 1, right: 2, back: 3, left:4 };
        this.direction = directions.forward;
    }

    changeDirection(newDirection) {
        newDirection = this.checkDirection(newDirection);
        this.direction = newDirection;
    }

    checkDirection(newDirection) {
        if(Math.abs(this.direction - newDirection) == 2)
            newDirection = this.direction;
        return newDirection;
    }

    drawSnake() {
        for (let i = 0; i < this.cellsNumber; i++) {
            this.cells[i].drawSquare()
        }
    }

    paintTheTail(){
        context.fillStyle = "#cfcfcf";
        context.fillRect(this.cells[this.cellsNumber - 1].returnCoordinatesX(), this.cells[this.cellsNumber - 1].returnCoordinatesY(),10,10);
    }

    motion() {
        for (let i = this.cellsNumber - 1; i > 0; i--) {
            this.cells[i].coordinatesChange(this.cells[i-1].returnCoordinatesX(),this.cells[i-1].returnCoordinatesY())
        }
        switch (this.direction) {
            case 1:
                this.cells[0].coordinatesChange(this.cells[0].returnCoordinatesX(), this.cells[0].returnCoordinatesY() - 10)
                break;
            case 2:
                this.cells[0].coordinatesChange(this.cells[0].returnCoordinatesX() + 10, this.cells[0].returnCoordinatesY())
                break;
            case 3:
                this.cells[0].coordinatesChange(this.cells[0].returnCoordinatesX(), this.cells[0].returnCoordinatesY() + 10)
                break;
            case 4:
                this.cells[0].coordinatesChange(this.cells[0].returnCoordinatesX() - 10, this.cells[0].returnCoordinatesY())
                break;
        }
    }
}

function update(snake) {
    snake.paintTheTail();
    snake.motion();
    snake.drawSnake()
    document.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "ArrowUp":
                snake.changeDirection(1);
                break;
            case "ArrowRight":
                snake.changeDirection(2);
                break;
            case "ArrowDown":
                snake.changeDirection(3);
                break;
            case "ArrowLeft":
                snake.changeDirection(4);
                break;
            default:
                break;
        }
    })
}
