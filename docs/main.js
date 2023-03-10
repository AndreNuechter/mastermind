window.addEventListener('DOMContentLoaded', ()=>{ if ('serviceWorker' in window.navigator) { window.navigator.serviceWorker.register('./service-worker.js'); } }, { once: true }); if ('wakeLock' in navigator && 'request' in navigator.wakeLock) { const getWakeLock = ()=>navigator.wakeLock.request('screen'); getWakeLock(); document.addEventListener('visibilitychange', ()=>{ if (document.visibilityState === 'visible') { getWakeLock(); } }); } function id(id) { return document.getElementById(id); } function classs(className) { return document.getElementsByClassName(className); } function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; } const circles = document.querySelectorAll('circle'); const colorSelect = id('colorInput'); const commitBtn = id('commit'); const undoBtn = id('undo'); const codeDisplay = id('code'); const guesses = classs('guess'); const guessDisplay = id('guess'); const resetBtn = id('reset'); const gameOverModal = id('game-over-message'); const blankKey = '_'; const colors = { r: 'red', b: 'blue', g: 'green', y: 'yellow', p: 'purple', o: 'orange', [blankKey]: 'grey' }; const colorKeys = Object.keys(colors); const answerColors = { b: 'black', w: 'white' }; const currentGuess = []; let guessesLeft; let code; window.onkeypress = (event)=>{ event.preventDefault(); const key = event.key.toLowerCase(); switch(key){ case 'enter': checkGuess(); break; case 'backspace': undoBtn.click(); break; case 'r': case 'b': case 'g': case 'y': case 'p': case 'o': case ' ': if (currentGuess.length < 4) { const colorCode = key === ' ' ? blankKey : key; currentGuess.push(colorCode); guessDisplay.children[currentGuess.length - 1].style.fill = colors[colorCode]; } } }; colorSelect.onclick = ({ target })=>{ if (currentGuess.length < 4 && guessesLeft > 0 && target.nodeName === 'circle') { const colorCode = target.dataset.code; currentGuess.push(colorCode); guessDisplay.children[currentGuess.length - 1].style.fill = colors[colorCode]; } }; commitBtn.onclick = checkGuess; undoBtn.onclick = ()=>{ if (currentGuess.length) { guessDisplay.children[currentGuess.length - 1].style.fill = colors[blankKey]; currentGuess.pop(); } }; resetBtn.onclick = resetBoard; gameOverModal.onclick = resetBoard; startGame(); function createCode() { return Array.from({ length: 4 }, ()=>colorKeys[getRandomInt(0, colorKeys.length - 1)]); } function startGame() { guessesLeft = guesses.length; code = createCode(); } function countColor(code, color) { return code.filter((e)=>e === color).length; } function checkGuess() { if (guessesLeft > 0) { let answer = new Array(4); let blacks = 0; while(currentGuess.length < 4){ currentGuess.push(blankKey); } for(let i = 0; i < 4; i += 1){ if (currentGuess[i] === code[i]) { blacks += 1; } } const whites = Object.keys(colors).reduce((a, color)=>a + Math.min(countColor(currentGuess, color), countColor(code, color)), 0) - blacks; answer = answer.fill('b', 0, blacks); answer = answer.fill('w', blacks, blacks + whites); guessesLeft -= 1; displayGuess(guesses[guessesLeft].children[0], currentGuess); displayAnswer(guesses[guessesLeft].children[1], answer); [ ...guessDisplay.children ].forEach((child)=>child.style.fill = colors[blankKey]); currentGuess.length = 0; if (answer.join('') === 'bbbb') { gameOverModal.textContent = 'Congratulations, you\'ve cracked the code'; gameOverModal.style.display = 'block'; displayGuess(codeDisplay, code); guessesLeft = 0; } else if (guessesLeft === 0) { gameOverModal.textContent = 'BOOOM!!!'; gameOverModal.style.display = 'block'; displayGuess(codeDisplay, code); } } } function displayGuess(display, code) { for(let i = 0; i < 4; i += 1){ display.children[i].style.fill = colors[code[i]]; } } function displayAnswer(display, answer) { for(let i = 0; i < 4; i += 1){ display.children[i].style.fill = answerColors[answer[i]]; } } function resetBoard() { currentGuess.length = 0; gameOverModal.style.display = 'none'; circles.forEach((circle)=>{ if (circle.parentNode !== colorSelect) { circle.style.fill = colors[blankKey]; } }); startGame(); }