let main = document.querySelector('.cells');

let playField = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const scoreElem = document.querySelector(".score");
const levelElem = document.querySelector(".level");
let score = 0;
let currentLevel = 1;

let possiblelevels = {
    1: {
        scorePerLine: 10,
        speed: 400,
        nextLevelScore: 10
    },
    2: {
        scorePerLine: 15,
        speed: 300,
        nextLevelScore: 20
    }
}

let activeTetro = {
    x: 0,
    y: 0,
    shape: [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ]
}

let figures = {
    O: [
        [1, 1],
        [1, 1]
    ],
    I: [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    L: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    J: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ],
}

function draw() {
    let mainInnerHTML = '';
    for (let y = 0; y < playField.length; y++) {
        for (let x = 0; x < playField[y].length; x++) {
            switch (playField[y][x]) {
                case 1:
                    mainInnerHTML += '<div class="cell cell__blue"></div>'
                    break;
                case 2:
                    mainInnerHTML += '<div class="cell cell__green"></div>'
                    break;
                default:
                    mainInnerHTML += '<div class="cell cell__void"></div>'
                    break;
            }
        }
    }
    main.innerHTML = mainInnerHTML
}

let getNewTetro = () => {
    let figuresNames = 'IOJTLSZ'
    let randTetro = Math.floor(Math.random() * 7);
    console.log('rand tetro ' + randTetro);
    return figures[figuresNames[randTetro]]
}

function removePrevActiveTetro() {
    for (let y = 0; y < playField.length; y++) {
        for (let x = 0; x < playField[y].length; x++) {
            if (playField[y][x] === 1)
                playField[y][x] = 0;
        }
    }
}

function updateActiveTetro() {
    removePrevActiveTetro()
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape.length; x++) {
            if (activeTetro.shape[y][x]) {
                playField[activeTetro.y + y][activeTetro.x + x] = activeTetro.shape[y][x];
            }
        }
    }
}

function hasCollisions() {
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape.length; x++) {
            if (activeTetro.shape[y][x] &&
                (playField[activeTetro.y + y] === undefined ||
                    playField[activeTetro.y + y][activeTetro.x + x] === undefined ||
                    playField[activeTetro.y + y][activeTetro.x + x] === 2))
                return true
        }
    }
    return false
}

// move figure in the left 
document.onkeydown = function (e) {
    switch (e.keyCode) {
        case 37:
            activeTetro.x -= 1
            if (hasCollisions()) {
                activeTetro.x += 1
            }
            break;
        case 39:
            activeTetro.x += 1
            if (hasCollisions()) {
                activeTetro.x -= 1
            }
            break;
        case 40:
            moveTetroDown()
            break;
        case 38:
            rotateTetro()
            break;
    }
    updateActiveTetro();
    draw()
}

function rotateTetro() {
    const prevTetroState = activeTetro.shape;
    activeTetro.shape = activeTetro.shape[0].map(
        (val, index) => activeTetro.shape.map(
            row => row[index])
        .reverse()
    )

    if (hasCollisions()) {
        activeTetro.shape = prevTetroState
    }
}

function removeFullLines() {
    let numberOfFilledColumns = 0,
        filledLines = 0;
    for (let y = 0; y < playField.length; y++) {
        for (let x = 0; x < playField[y].length; x++) {
            numberOfFilledColumns = 0;
            for (const iterator of playField[y]) {
                if (iterator === 2) {
                    numberOfFilledColumns++;
                }
            }
            if (numberOfFilledColumns === 10) {
                playField.splice(y, 1)
                playField.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
                filledLines += 1
            }
        }
    }

    switch (filledLines) {
        case 1:
            score += 10;
            break;
        case 2:
            score += 20;
            break;
        case 3:
            score += 30;
            break;
        case 4:
            score += 40;
            break;
    }
    scoreElem.innerHTML = score;
    if (score >= possiblelevels[currentLevel].nextLevelScore)
        levelElem.innerHTML = currentLevel++;
}


function fixTetro() {
    for (let y = 0; y < playField.length; y++) {
        for (let x = 0; x < playField[y].length; x++) {
            if (playField[y][x] === 1) {
                playField[y][x] = 2
            }
        }
    }
    removeFullLines()
}

function moveTetroDown() {
    activeTetro.y += 1
    if (hasCollisions()) {
        activeTetro.y -= 1
        fixTetro()
        removeFullLines()
        activeTetro.shape = getNewTetro()
        activeTetro.x = Math.floor((10 - activeTetro.shape[0].length) / 2)
        console.log(activeTetro.x);
        activeTetro.y = 0
    }
}

function startGame() {
    moveTetroDown();
    updateActiveTetro();
    draw();
    setTimeout(startGame, possiblelevels[currentLevel].speed)
}

setTimeout(startGame, possiblelevels[currentLevel].speed)