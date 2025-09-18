
let solutionBoard = []; // stores the full solution for checking
const gridSize = 9;
const sudokuGrid = document.getElementById("sudokuGrid");
let board = [];

function createEmptyGrid() {
    return Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
}

// Check if number can be placed
function isSafe(board, row, col, num) {
    for (let x = 0; x < gridSize; x++) {
        if (board[row][x] === num || board[x][col] === num) return false;
    }
    const startRow = row - row % 3, startCol = col - col % 3;
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            if (board[startRow+i][startCol+j] === num) return false;
    return true;
}

// Backtracking solver to fill grid
function fillBoard(board) {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (board[row][col] === 0) {
                const numbers = shuffle(Array.from({length: 9}, (_, i) => i+1));
                for (const num of numbers) {
                    if (isSafe(board, row, col, num)) {
                        board[row][col] = num;
                        if (fillBoard(board)) return true;
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function giveHint(board, solutionBoard) {
    // Find all empty cells
    const emptyCells = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({ i, j });
            }
        }
    }

    if (emptyCells.length === 0) {
        alert("No empty cells left!");
        return;
    }

    // Pick a random empty cell
    const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    // Fill it with the correct solution number
    board[i][j] = solutionBoard[i][j];

    // Update the HTML cell
    const table = document.getElementById("sudokuGrid");

    const cell = table.rows[i].cells[j];

    // Clear any input box and show the fixed number
    cell.innerHTML = solutionBoard[i][j];
    cell.classList.add("hint"); // style differently if you want
}

// Shuffle helper
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Remove numbers based on difficulty
function removeNumbers(board, difficulty) {
    let attempts;
    if (difficulty === "easy") attempts = 30;
    else if (difficulty === "medium") attempts = 40;
    else attempts = 50;

    while (attempts > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) {
            board[row][col] = 0;
            attempts--;
        }
    }
    return board;
}

// Render the Sudoku grid
function renderSudoku(board) {
    const sudokuGrid = document.getElementById("sudokuGrid");
    sudokuGrid.innerHTML = "";

    for (let i = 0; i < board.length; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < board[i].length; j++) {
            const td = document.createElement("td");
            td.style.border = "1px solid black";
            td.style.width = "40px";
            td.style.height = "40px";
            td.style.textAlign = "center";

            if (board[i][j] !== 0) {
                td.textContent = board[i][j];
            } else {
                const input = document.createElement("input");
                input.type = "text";
                input.maxLength = 1;
                input.style.width = "100%";
                input.style.height = "100%";
                input.style.fontSize = "20px";
                input.style.textAlign = "center";

                input.addEventListener("input", () => checkSudokuCompletion());
                // Check mistakes on input
                input.addEventListener("input", () => checkMistakes(i, j, input));
                td.appendChild(input);
            }

            tr.appendChild(td);
        }
        sudokuGrid.appendChild(tr);
    }
}

function checkSudokuCompletion() {
    const inputs = document.querySelectorAll("#sudokuGrid input");
    let complete = true;

    inputs.forEach((input, idx) => {
        const row = Math.floor(idx / 9);
        const col = idx % 9;
        const val = parseInt(input.value);
        if (val !== solutionBoard[row][col]) complete = false;
    });

    const msg = document.getElementById("sudokuMessage");
    if (complete) msg.textContent = "🎉 Congratulations! Sudoku completed!";
    else msg.textContent = "";
}

function checkMistakes(row, col, input) {
    const val = parseInt(input.value);
    if (!val || val < 1 || val > 9) {
        input.style.color = "black";
        return;
    }

    if (val !== solutionBoard[row][col]) {
        input.style.color = "red";
    } else {
        input.style.color = "green";
    }

    checkSudokuCompletion();
}

function initSudoku() {
    const generateBtn = document.getElementById("generateBtn");
    if (!generateBtn) return;

    generateBtn.addEventListener("click", () => {
        const difficulty = document.getElementById("difficulty").value;
        // Your sudoku generation and rendering code
        document.getElementById("sudokuMessage").textContent = `Sudoku (${difficulty}) generated!`;
    });
}

// Generate Sudoku
document.getElementById("generateBtn").addEventListener("click", () => {
    board = createEmptyGrid();
    fillBoard(board);

    solutionBoard = board.map(row => [...row]);
    const difficulty = document.getElementById("difficulty").value;
    board = removeNumbers(board, difficulty);
    renderSudoku(board);
    document.getElementById("sudokuMessage").textContent = `Sudoku (${difficulty}) generated!`;
});
