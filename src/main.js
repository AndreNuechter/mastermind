import './js/service-worker-init.js';
import './js/wakelock.js';
import { getRandomInt } from './js/helper-functions.js';
import {
    circles,
    codeDisplay,
    colorSelect,
    commitBtn,
    gameOverModal,
    guessDisplay,
    guesses,
    resetBtn,
    undoBtn,
} from './js/dom-selections.js';
import { answerColors, blankKey, colorKeys, colors } from './js/constants.js';

// TODO prevent scrolling on mobile
// TODO implement roleswitching and Knuths alg

const currentGuess = [];
let guessesLeft;
let code;

window.onkeypress = (event) => {
    event.preventDefault();

    const key = event.key.toLowerCase();

    switch (key) {
        case 'enter':
            checkGuess();
            break;
        case 'backspace':
            undoBtn.click();
            break;
        case 'r':
        case 'b':
        case 'g':
        case 'y':
        case 'p':
        case 'o':
        case ' ':
            if (currentGuess.length < 4) {
                const colorCode = key === ' ' ? blankKey : key;
                currentGuess.push(colorCode);
                guessDisplay.children[currentGuess.length - 1].style.fill = colors[colorCode];
            }
    }
};

colorSelect.onclick = ({ target }) => {
    if (currentGuess.length < 4 && guessesLeft > 0 && target.nodeName === 'circle') {
        const colorCode = target.dataset.code;
        currentGuess.push(colorCode);
        guessDisplay.children[currentGuess.length - 1].style.fill = colors[colorCode];
    }
};

commitBtn.onclick = checkGuess;

undoBtn.onclick = () => {
    if (currentGuess.length) {
        guessDisplay.children[currentGuess.length - 1].style.fill = colors[blankKey];
        currentGuess.pop();
    }
};

resetBtn.onclick = resetBoard;

startGame();

function createCode() {
    return Array.from(
        { length: 4 },
        () => colorKeys[getRandomInt(0, colorKeys.length - 1)],
    );
}

function startGame() {
    guessesLeft = guesses.length;
    code = createCode();
}

function countColor(code, color) {
    return code.filter((e) => e === color).length;
}

function checkGuess() {
    if (guessesLeft > 0) {
        let answer = new Array(4);
        let blacks = 0;

        // pad guess
        while (currentGuess.length < 4) {
            currentGuess.push(blankKey);
        }

        // count correct guesses
        for (let i = 0; i < 4; i++) {
            if (currentGuess[i] === code[i]) {
                blacks++;
            }
        }
        // count close-to-correct guesses
        const whites = Object.keys(colors).reduce((a, color) =>
            a + Math.min(countColor(currentGuess, color), countColor(code, color)), 0) - blacks;
        // assemble final answer
        answer = answer.fill('b', 0, blacks);
        answer = answer.fill('w', blacks, blacks + whites);
        // detract one guess
        guessesLeft--;
        // display guess and answer to it
        displayGuess(guesses[guessesLeft].children[0], currentGuess);
        displayAnswer(guesses[guessesLeft].children[1], answer);
        // clear guessdisplay and guess
        [...guessDisplay.children].forEach((child) =>
            child.style.fill = colors[blankKey]
        );
        currentGuess.length = 0;
        // check for end of game
        if (answer.join('') === 'bbbb') {
            gameOverModal.textContent = 'Congratulations, you\'ve cracked the code';
            gameOverModal.style.display = 'block';
            displayGuess(codeDisplay, code);
            guessesLeft = 0;
        } else if (guessesLeft === 0) {
            gameOverModal.textContent = 'BOOOM!!!';
            gameOverModal.style.display = 'block';
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
    for (let i = 0; i < 4; i++) {
        display.children[i].style.fill = answerColors[answer[i]];
    }
}

function resetBoard() {
    currentGuess.length = 0;
    gameOverModal.style.display = 'none';
    circles.forEach((circle) => {
        if (circle.parentNode !== colorSelect) {
            circle.style.fill = colors[blankKey];
        }
    });
    startGame();
}
