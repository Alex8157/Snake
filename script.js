// Инициализация переменных
function init() {
    canvas = document.getElementById("snake");
    canvas.width = 480;
    canvas.height = 480;
    context = canvas.getContext('2d');
    draw();
    let x = new snake
    x.draw()
}
// Отрисовка игры
function draw() {
    context.fillStyle = "#cfcfcf";
    context.fillRect(0, 0, 480, 480);
}

class square {
    constructor(color, x, y, width, height) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
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
        this.cellsNumber = 3;
        this.cells = [
            new square("#000", 240,240,10,10),
            new square("#000", 240,250,10,10),
            new square("#000", 240,260,10,10)
            ];
        this.direction = 1;
    }

    draw() {
        for (let i = 0; i < this.cellsNumber; i++) {
            this.cells[i].draw()
        }
    }

    motion() {
        context.fillStyle = "#cfcfcf";
        context.fillRect(this.cells[this.cellsNumber - 1].returnCoordinatesX(), this.cells[this.cellsNumber - 1].returnCoordinatesY(),10,10);
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
        this.draw()
    }
}

function update(snake) {
    snake.motion();
}
