const puzzleSize = 4;
let tiles = [];
let emptyIndex;

function initPuzzle() {
    tiles = [];
    const puzzle = document.getElementById("puzzle");
    puzzle.innerHTML = "";

    // Create tiles 1-15
    for (let i = 1; i < puzzleSize * puzzleSize; i++) {
        tiles.push(i);
    }
    tiles.push(null); // empty tile
    shuffle(tiles);

    emptyIndex = tiles.indexOf(null);

    // Render tiles
    tiles.forEach((num, idx) => {
        const div = document.createElement("div");
        div.className = num ? "tile" : "tile empty";
        div.textContent = num ? num : "";
        div.addEventListener("click", () => moveTile(idx));
        puzzle.appendChild(div);
    });

    document.getElementById("message").textContent = "";
}

// Fisher-Yates shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Move tile if next to empty
function moveTile(idx) {
    const rowEmpty = Math.floor(emptyIndex / puzzleSize);
    const colEmpty = emptyIndex % puzzleSize;
    const rowTile = Math.floor(idx / puzzleSize);
    const colTile = idx % puzzleSize;

    const isAdjacent = (Math.abs(rowEmpty - rowTile) + Math.abs(colEmpty - colTile)) === 1;
    if (!isAdjacent) return;

    // Swap
    [tiles[emptyIndex], tiles[idx]] = [tiles[idx], tiles[emptyIndex]];
    emptyIndex = idx;
    renderTiles();

    if (checkWin()) {
        document.getElementById("message").textContent = "🎉 Puzzle Completed!";
    }
}

function renderTiles() {
    const puzzle = document.getElementById("puzzle");
    Array.from(puzzle.children).forEach((div, idx) => {
        div.textContent = tiles[idx] ? tiles[idx] : "";
        div.className = tiles[idx] ? "tile" : "tile empty";
    });
}

function checkWin() {
    for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i] !== i + 1) return false;
    }
    return true;
}

function initSlidingPuzzle() {
    const puzzle = document.getElementById("puzzle");
    const resetBtn = document.getElementById("resetPuzzleBtn");
    const msg = document.getElementById("puzzleMessage");

    if (!puzzle) return;

    // Your sliding puzzle code here
    // e.g., generate tiles, handle clicks, etc.
}

document.getElementById("resetBtn").addEventListener("click", initPuzzle);

// Initialize on tab load
initPuzzle();
