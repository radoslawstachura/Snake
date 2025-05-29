window.onload = function () {
    console.log("Działa");
    game.init();
}

const game = {
    body: document.body,
    board: null,
    direction: null,
    moveInterval: null,
    appleInterval: null,
    started: false,
    directionChanged: false,
    snakeLength: 1,
    snakePartsIndexes: [],
    applesIndexes: [],
    boardArray: [],

    init: function () {
        this.board = document.createElement("table");
        this.board.id = "board";

        for (let i = 0; i < 21; i++) {
            const row = document.createElement("tr");
            const rowArray = [];

            for (let j = 0; j < 21; j++) {
                const cell = document.createElement("td");
                let value = 0;
                if (i == 10 && j == 10) {
                    cell.classList.add("snake");
                    value = 1;
                    this.snakePartsIndexes.push({ x: 10, y: 10 });
                }
                else if (i == 0 || i == 20 || j == 0 || j == 20) {
                    cell.classList.add("band");
                    value = -1;
                }
                row.append(cell);
                rowArray.push({
                    y: i,
                    x: j,
                    value: value,
                    element: cell,
                    bg: "-120px -30px"
                });
            }

            this.board.append(row);
            this.boardArray.push(rowArray);
        }

        this.body.append(this.board);

        window.addEventListener("keydown", (e) => {
            if (e.code == "ArrowLeft" ||
                e.code == "ArrowRight" ||
                e.code == "ArrowUp" ||
                e.code == "ArrowDown"
            ) {
                console.log("klik");
                this.changeDirection(e);
                this.directionChanged = true;
                this.started = true;
                if (!this.moveInterval) {
                    console.log("interval move");
                    this.moveInterval = setInterval(() => {
                        this.move(this);
                    }, 100);
                }
                if (!this.appleInterval) {
                    console.log("interval jabłko");
                    this.appleInterval = setInterval(() => {
                        this.generateApple(this);
                    }, 1500);
                }
            }
        });
    },

    changeDirection: function (e) {
        if (!this.directionChanged) {
            const key = e.code;

            if (key == "ArrowLeft") {
                if (this.direction != "right") {
                    this.direction = "left";
                }
            } else if (key == "ArrowRight") {
                if (this.direction != "left") {
                    this.direction = "right";
                }
            } else if (key == "ArrowUp") {
                if (this.direction != "bottom") {
                    this.direction = "up";
                }
            } else if (key == "ArrowDown") {
                if (this.direction != "up") {
                    this.direction = "bottom";
                }
            }
        } else {
            console.log("już zmieniłeś kierunek dla tego ruchu");
        }
    },

    move: function (context) {
        const head = context.snakePartsIndexes[0];
        const tail = context.snakePartsIndexes[context.snakePartsIndexes.length - 1];
        const headX = head.x;
        const headY = head.y;
        const tailX = tail.x;
        const tailY = tail.y;

        let newHead;
        let newBg;

        if (context.direction == "left") {
            newHead = { y: headY, x: headX - 1 };
            newBg = "-90px -30px";
        } else if (context.direction == "right") {
            newHead = { y: headY, x: headX + 1 };
            newBg = "-120px 0px";
        } else if (context.direction == "up") {
            newHead = { y: headY - 1, x: headX };
            newBg = "-90px 0px";
        } else if (context.direction == "bottom") {
            newHead = { y: headY + 1, x: headX };
            newBg = "-120px -30px";
        }

        if (newHead.x <= 0 ||
            newHead.x >= 20 ||
            newHead.y <= 0 ||
            newHead.y >= 20 ||
            (context.boardArray[newHead.y][newHead.x].value == 1
                && (newHead.y != tail.y || newHead.x != tail.x)
            )
        ) {
            clearInterval(context.moveInterval);
            clearInterval(context.appleInterval);
        } //else {
        // if (context.boardArray[newHead.y][newHead.x].value == 1) {
        //     alert("Finito");
        //     clearInterval(context.moveInterval);
        // }

        context.boardArray[newHead.y][newHead.x].bg = newBg;
        context.boardArray[newHead.y][newHead.x].element.style.backgroundPosition = context.boardArray[newHead.y][newHead.x].bg;

        if (context.snakeLength > 1) {
            const boardCopy = [];

            for (let i = 0; i < context.snakePartsIndexes.length; i++) {
                boardCopy.push(context.snakePartsIndexes[i]);
            }

            context.snakePartsIndexes[context.snakePartsIndexes.length - 1] = boardCopy[context.snakePartsIndexes.length - 2];
            for (let i = context.snakePartsIndexes.length - 2; i > 0; i--) {
                context.snakePartsIndexes[i] = boardCopy[i - 1];
            }
        }

        if (context.boardArray[newHead.y][newHead.x].value == 2) {
            context.snakeLength++;
            context.snakePartsIndexes.push({ x: tailX, y: tailY });
            for (let i = 0; i < context.applesIndexes.length; i++) {
                if (context.applesIndexes[i].y == newHead.y &&
                    context.applesIndexes[i].x == newHead.x
                ) {
                    context.applesIndexes.splice(i, 1);
                }
            }
        }

        for (let i = 1; i < 20; i++) {
            for (let j = 1; j < 20; j++) {
                context.boardArray[i][j].value = 0;
            }
        }
        context.boardArray[newHead.y][newHead.x].value = 1;
        context.snakePartsIndexes[0] = newHead;
        for (let i = 0; i < context.applesIndexes.length; i++) {
            const y = context.applesIndexes[i].y;
            const x = context.applesIndexes[i].x;
            context.boardArray[y][x].value = 2;
        }
        if (context.snakeLength > 1) {
            for (let i = 0; i < context.snakePartsIndexes.length; i++) {
                const y = context.snakePartsIndexes[i].y;
                const x = context.snakePartsIndexes[i].x;
                context.boardArray[y][x].value = 1;
            }

            const lastY = context.snakePartsIndexes[context.snakePartsIndexes.length - 1].y;
            const lastX = context.snakePartsIndexes[context.snakePartsIndexes.length - 1].x;

            const prevY = context.snakePartsIndexes[context.snakePartsIndexes.length - 2].y;
            const prevX = context.snakePartsIndexes[context.snakePartsIndexes.length - 2].x;

            const xDifference = prevX - lastX;
            const yDifference = prevY - lastY;

            if (xDifference == -1 && yDifference == 0) {
                context.boardArray[lastY][lastX].bg = "-90px -90px";
            } else if (xDifference == 1 && yDifference == 0) {
                context.boardArray[lastY][lastX].bg = "-120px -60px";
            } else if (xDifference == 0 && yDifference == -1) {
                context.boardArray[lastY][lastX].bg = "-90px -60px";
            } else if (xDifference == 0 && yDifference == 1) {
                context.boardArray[lastY][lastX].bg = "-120px -90px";
            }

            if (context.snakeLength > 2) {
                for (let i = context.snakePartsIndexes.length - 2; i > 0; i--) {
                    const currentY = context.snakePartsIndexes[i].y;
                    const currentX = context.snakePartsIndexes[i].x;

                    const nextY = context.snakePartsIndexes[i - 1].y;
                    const nextX = context.snakePartsIndexes[i - 1].x;

                    const previousY = context.snakePartsIndexes[i + 1].y;
                    const previousX = context.snakePartsIndexes[i + 1].x;

                    const previousXDiff = previousX - currentX;
                    const previousYDiff = previousY - currentY;

                    const nextXDiff = nextX - currentX;
                    const nextYDiff = nextY - currentY;

                    if (previousYDiff == 0 && nextYDiff == 0) {
                        console.log("poziome");
                        context.boardArray[currentY][currentX].bg = "-30px 0px";
                    } else if (previousXDiff == 0 && nextXDiff == 0) {
                        console.log("pionowe");
                        context.boardArray[currentY][currentX].bg = "-60px -30px";
                    } else if ((previousYDiff == 1 && nextXDiff == 1)) {
                        context.boardArray[currentY][currentX].bg = "0px 0px";
                    } else if ((previousYDiff == -1 && nextXDiff == -1)) {
                        context.boardArray[currentY][currentX].bg = "-60px -60px";
                    } else if ((previousYDiff == -1 && nextXDiff == 1)) {
                        context.boardArray[currentY][currentX].bg = "0px -30px";
                    } else if ((previousYDiff == 1 && nextXDiff == -1)) {
                        context.boardArray[currentY][currentX].bg = "-60px 0px";
                    } else if ((previousXDiff == 1 && nextYDiff == 1)) {
                        context.boardArray[currentY][currentX].bg = "0px 0px";
                    } else if ((previousXDiff == -1 && nextYDiff == -1)) {
                        context.boardArray[currentY][currentX].bg = "-60px -60px";
                    } else if ((previousXDiff == -1 && nextYDiff == 1)) {
                        context.boardArray[currentY][currentX].bg = "-60px 0px";
                    } else if ((previousXDiff == 1 && nextYDiff == -1)) {
                        context.boardArray[currentY][currentX].bg = "0px -30px";
                    }
                }
            }
        }
        //}

        context.generateBoard();
        this.directionChanged = false;
    },

    generateBoard() {
        while (this.board.firstChild)
            this.board.firstChild.remove();

        for (let i = 0; i < 21; i++) {
            const row = document.createElement("tr");

            for (let j = 0; j < 21; j++) {
                const cell = document.createElement("td");

                if (this.boardArray[i][j].value == 1) {
                    cell.classList.add("snake");
                    cell.style.backgroundPosition = this.boardArray[i][j].bg;
                } else if (this.boardArray[i][j].value == -1) {
                    cell.classList.add("band");
                } else if (this.boardArray[i][j].value == 2) {
                    cell.classList.add("apple");
                }

                row.append(cell);
            }

            this.board.append(row);
        }

    },

    generateApple(context) {
        console.log("jabłko");
        let y, x;
        do {
            y = Math.floor(Math.random() * 19) + 1;
            x = Math.floor(Math.random() * 19) + 1;
        } while (context.boardArray[y][x].value == 1 ||
            context.boardArray[y][x].value == 2)

        context.applesIndexes.push({ y: y, x: x });
        context.boardArray[y][x].value = 2;
        context.boardArray[y][x].element.classList.add("apple");
    }
}