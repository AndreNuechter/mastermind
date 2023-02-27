import './js/service-worker-init.js';
import './js/wakelock.js';

// TODO implement roleswitching and Knuths alg

function id(id) {
    return document.getElementById(id);
}

function classs(className) {
    return document.getElementsByClassName(className);
}

function elmnts(tagName) {
    return document.getElementsByTagName(tagName);
}

const circles = elmnts('circle');
const colors = {
    r: 'red',
    b: 'blue',
    g: 'green',
    y: 'yellow',
    p: 'purple',
    o: 'orange',
    _: 'grey',
};
const input = id('colorInput');
const commit = id('commit');
const undo = id('undo');
const codeDisplay = id('code');
const guesses = classs('guess');
const guessDisplay = id('guess');
const options = id('options');
const gameOver = id('game-over-message');
const guess = [];
let guessesLeft, code;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createCode() {
    const code = [];
    for (let i = 0; i < 4; i++) {
        code.push(Object.keys(colors)[getRandomInt(0, Object.keys(colors).length - 1)]);
    }
    return code;
}

function startGame() {
    guessesLeft = guesses.length;
    code = createCode();
}

function countColor(code, color) {
    return code.filter((e) => e === color).length;
}

function checkGuess() {
    if (guess.length === 4 && guessesLeft > 0) {
        let answer = new Array(4);
        let blacks = 0;
        // count correct guesses
        for (let i = 0; i < 4; i++) {
            if (guess[i] === code[i]) {
                blacks++;
            }
        }
        // count close-to-correct guesses
        const whites = Object.keys(colors).reduce((a, color) =>
            a + Math.min(countColor(guess, color), countColor(code, color)), 0) - blacks;
        // assemble final answer
        answer = answer.fill('b', 0, blacks);
        answer = answer.fill('w', blacks, blacks + whites);
        // detract one guess
        guessesLeft--;
        // display guess and answer to it
        displayGuess(guesses[guessesLeft].children[0], guess);
        displayAnswer(guesses[guessesLeft].children[1], answer);
        // clear guessdisplay and guess
        [...guessDisplay.children].forEach((c) =>
            c.style.fill = 'grey'
        );
        guess.length = 0;
        // check for end of game
        if (answer.join('') === 'bbbb') {
            gameOver.textContent = 'Congratulations, you\'ve cracked the code';
            gameOver.style.display = 'block';
            displayGuess(codeDisplay, code);
            guessesLeft = 0;
        } else if (guessesLeft === 0) {
            gameOver.textContent = 'BOOOM!!!';
            gameOver.style.display = 'block';
            displayGuess(codeDisplay, code);
        }
    }
}

function displayGuess(display, code) {
    for (let i = 0; i < 4; i++) {
        display.children[i].style.fill = colors[code[i]];
    }
}

function displayAnswer(display, answer) {
    const answerCodes = { b: 'black', w: 'white' };
    for (let i = 0; i < 4; i++) {
        display.children[i].style.fill = answerCodes[answer[i]];
    }
}

function resetBoard() {
    guess.length = 0;
    gameOver.style.display = 'none';
    for (let i = 0; i < circles.length; i++) {
        if (circles[i].parentNode.id !== 'colorInput') circles[i].style.fill = 'grey';
    }
    startGame();
}

window.onkeypress = (event) => {
    event.preventDefault();

    switch (event.key.toLowerCase()) {
        case 'enter':
            checkGuess();
            break;
        case 'backspace':
            undo.dispatchEvent(new Event('click'));
            break;
        case 'r':
        case 'b':
        case 'g':
        case 'y':
        case 'p':
        case 'o':
        case ' ':
            if (guess.length < 4) {
                const colorCode = event.key === ' ' ? '_' : event.key.toLowerCase();
                guess.push(colorCode);
                guessDisplay.children[guess.length - 1].style.fill = colors[colorCode];
            }
    }
};

input.onclick = (event) => {
    if (guess.length < 4 && guessesLeft > 0 && event.target.nodeName === 'circle') {
        const colorCode = event.target.getAttribute('data-code');
        guess.push(colorCode);
        guessDisplay.children[guess.length - 1].style.fill = colors[colorCode];
    }
};

commit.onclick = () => {
    checkGuess();
};

undo.onclick = () => {
    if (guess.length) {
        guessDisplay.children[guess.length - 1].style.fill = 'grey';
        guess.pop();
    }
};

options.onclick = ({ target: { id } }) => {
    if (id === 'reset') resetBoard();
    else if (id === 'switch') {
        resetBoard();
    }
};

startGame();
