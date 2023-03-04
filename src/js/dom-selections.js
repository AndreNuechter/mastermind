import { classs, id } from './helper-functions.js';

export const circles = document.querySelectorAll('circle');
export const colorSelect = id('colorInput');
export const commitBtn = id('commit');
export const undoBtn = id('undo');
export const codeDisplay = id('code');
export const guesses = classs('guess');
export const guessDisplay = id('guess');
export const resetBtn = id('reset');
export const gameOverModal = id('game-over-message');
