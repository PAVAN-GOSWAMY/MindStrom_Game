let originalGrid = [];
let rows, cols, memorizeTime, answerTime;
let memorizeTimer, answerTimer;
let gameEnded = false;
let musicPlaying = false;

// Function to display level selection buttons
function showLevels() {
    document.getElementById('start_button').style.display = 'none';
    document.getElementById('music_button').style.display = 'none';
    document.getElementById('music_message').style.display = 'none';
    document.getElementById('level_selection').style.display = 'flex';
}

// Function to set up the game based on the selected difficulty level
function selectLevel(level) {
    document.getElementById('level_selection').style.display = 'none';
    document.getElementById('row_column_selection').style.display = 'flex';

    if (level === 'easy') {
        populateSelectOptions(document.getElementById('rowsSelect'), 1, 3);
        populateSelectOptions(document.getElementById('colsSelect'), 1, 3);
        memorizeTime = 10;
        answerTime = 15;
    } else if (level === 'medium') {
        populateSelectOptions(document.getElementById('rowsSelect'), 4, 6);
        populateSelectOptions(document.getElementById('colsSelect'), 4, 6);
        memorizeTime = 15;
        answerTime = 25;
    } else if (level === 'hard') {
        populateSelectOptions(document.getElementById('rowsSelect'), 7, 9);
        populateSelectOptions(document.getElementById('colsSelect'), 7, 9);
        memorizeTime = 20;
        answerTime = 30;
    }
}

// Function to populate select options for rows and columns
function populateSelectOptions(select, min, max) {
    select.innerHTML = '';
    for (let i = min; i <= max; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        select.appendChild(option);
    }
}

// Function to show the start game button
function showStartGameButton() {
    document.getElementById('row_column_selection').style.display = 'none';
    document.getElementById('start_game_container').style.display = 'flex';
}

// Function to start the game
function startGame() {
    rows = parseInt(document.getElementById('rowsSelect').value);
    cols = parseInt(document.getElementById('colsSelect').value);
    document.getElementById('start_game_container').style.display = 'none';
    startMemorizePhase();
}

// Function to generate the grid with random values
function generateGrid() {
    const gameGrid = document.getElementById('gameGrid');
    gameGrid.innerHTML = '';
    gameGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    gameGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    originalGrid = [];

    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const value = getRandomValue();
            row.push(value);
            const cell = document.createElement('div');
            cell.classList.add('grid-item');
            cell.textContent = value;
            cell.style.background = randomColor();
            gameGrid.appendChild(cell);
        }
        originalGrid.push(row);
    }
}

// Function to start the memorize phase of the game
function startMemorizePhase() {
    generateGrid();
    document.getElementById('timers').style.display = 'flex';
    startMemorizeTimer();
    document.getElementById('gameGrid').style.display = 'grid';
    setTimeout(() => {
        document.getElementById('gameGrid').style.display = 'none';
        stopMemorizeTimer();
        showInputGrid();
    }, memorizeTime * 1000);
}

// Function to start the memorize timer
function startMemorizeTimer() {
    const memorizeTimeDisplay = document.getElementById('memorizeTime');
    let remainingTime = memorizeTime;
    memorizeTimer = setInterval(() => {
        let minutes = Math.floor(remainingTime / 60);
        let seconds = remainingTime % 60;
        memorizeTimeDisplay.textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;
        remainingTime--;
        if (remainingTime < 0) {
            clearInterval(memorizeTimer);
        }
    }, 1000);
}

// Function to stop the memorize timer
function stopMemorizeTimer() {
    clearInterval(memorizeTimer);
}

// Function to format time (add leading zero if needed)
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Function to start the answer timer
function startAnswerTimer() {
    const answerTimeDisplay = document.getElementById('answerTime');
    let remainingTime = answerTime;
    answerTimer = setInterval(() => {
        let minutes = Math.floor(remainingTime / 60);
        let seconds = remainingTime % 60;
        answerTimeDisplay.textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;
        remainingTime--;

        if (remainingTime < 0) {
            clearInterval(answerTimer);
            if (!gameEnded) {
                checkAnswer(true);
            }
        }
    }, 1000);
}

// Function to display the input grid for user answers
function showInputGrid() {
    const inputGrid = document.getElementById('inputGrid');
    inputGrid.innerHTML = '';
    inputGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    inputGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    inputGrid.style.display = 'grid';

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const inputCell = document.createElement('input');
            inputCell.classList.add('grid-item');
            inputCell.setAttribute('type', 'text');
            inputCell.setAttribute('maxlength', '3');
            inputCell.style.background = randomColor();
            inputGrid.appendChild(inputCell);
        }
    }

    document.getElementById('submitAnswerButton').style.display = 'block';
    startAnswerTimer();
}

// Function to check the user's answer
function checkAnswer(timeUp = false) {
    if (gameEnded) return;

    const inputGrid = document.getElementById('inputGrid');
    const inputs = inputGrid.getElementsByTagName('input');
    let correct = true;
    let index = 0;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (inputs[index].value !== originalGrid[i][j]) {
                correct = false;
            }
            index++;
        }
    }

    if (timeUp) {
        gameEnded = true;
        clearInterval(answerTimer);
        alert('Time\'s up!');
        showResults(correct);
    } else if (correct) {
        gameEnded = true;
        clearInterval(answerTimer);
        showResults(true);
    } else {
        alert('Not quite right. Keep trying!');
        return;
    }

    setTimeout(() => {
        resetGame();
    }, 500);
}

// Function to display the results of the game
function showResults(correct) {
    if (correct) {
        alert('Congratulations! You remembered everything correctly!');
    } else {
        alert('Your answer was incorrect. Better luck next time!');
    }
}

// Function to generate a random color
function randomColor() {
    let val1 = Math.ceil(60 + Math.random() * 165);
    let val2 = Math.ceil(60 + Math.random() * 255);
    let val3 = Math.ceil(60 + Math.random() * 255);
    return `rgb(${val1},${val2},${val3})`;
}

// Function to get a random value for the grid
function getRandomValue() {
    const values = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '+', '-',
        'cat', 'dog', 'sun', 'on', 'sky', 'car', 'bus', 'box', 'hat', 'pen'
    ];
    return values[Math.floor(Math.random() * values.length)];
}

// Function to toggle the background music
function toggleMusic() {
    const music = document.getElementById('backgroundMusic');
    const musicButton = document.getElementById('music');

    if (musicPlaying) {
        music.muted = true;
        musicButton.textContent = 'Unmute Music';
    } else {
        music.muted = false;
        music.play();
        musicButton.textContent = 'Mute Music';
    }

    musicPlaying = !musicPlaying;
}

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', (event) => {
    const music = document.getElementById('backgroundMusic');
    const musicMessage = document.getElementById('music_message');

    // Try to play muted music on page load
    music.play().catch(error => {
        console.log('Autoplay failed:', error);
    });

    // Add click event listener to the document
    document.addEventListener('click', function onFirstClick() {
        music.play();
        musicMessage.style.display = 'none';
        // Remove the click event listener after first click
        document.removeEventListener('click', onFirstClick);
    }, { once: true });
});

// Function to reset the game state
function resetGame() {
    gameEnded = false;
    document.getElementById('timers').style.display = 'none';
    document.getElementById('inputGrid').style.display = 'none';
    document.getElementById('gameGrid').style.display = 'none';
    document.getElementById('submitAnswerButton').style.display = 'none';
    document.getElementById('start_button').style.display = 'block';
    document.getElementById('music_button').style.display = 'block';
}