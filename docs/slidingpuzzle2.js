// Working version for all pieces

const puzzleSize = 4;
let tiles = [];
let nextHintTile = 1;  // The tile we are currently solving
let currentPlan = [];   // The A* plan for the current tile

// Initialize puzzle
function initSlidingPuzzle() {
    const puzzle = document.getElementById("puzzle");
    const resetBtn = document.getElementById("resetPuzzleBtn");
    const msg = document.getElementById("puzzleMessage");

    if (!puzzle) return;

    puzzle.innerHTML = "";
    msg.textContent = "";

    // Generate shuffled numbers 1..15 + empty
    tiles = shuffleSolvable();
    renderPuzzle();
    nextHintTile = 1;
    currentPlan = [];

    resetBtn.onclick = initSlidingPuzzle;
}

function shuffleSolvable() {
    let arr = [...Array(puzzleSize * puzzleSize).keys()].slice(1);
    arr.push(""); // empty slot

    do {
        arr.sort(() => Math.random() - 0.5);
    } while (!isSolvable(arr));

    return arr;
}

// Check if a 4x4 puzzle array is solvable
function isSolvable(puzzle) {
    const N = puzzleSize;
    let inversions = 0;
    const tiles = puzzle.filter(t => t !== ""); // ignore empty

    for (let i = 0; i < tiles.length; i++) {
        for (let j = i + 1; j < tiles.length; j++) {
            if (tiles[i] > tiles[j]) inversions++;
        }
    }

    const emptyRowFromBottom = N - Math.floor(puzzle.indexOf("") / N);

    if (N % 2 === 0) {
        return (emptyRowFromBottom % 2 === 0 && inversions % 2 === 1) ||
               (emptyRowFromBottom % 2 === 1 && inversions % 2 === 0);
    } else {
        return inversions % 2 === 0;
    }
}


function renderPuzzle() {
    const puzzle = document.getElementById("puzzle");
    puzzle.innerHTML = "";

    tiles.forEach((num, index) => {
        const div = document.createElement("div");
        div.className = num === "" ? "tile empty" : "tile";
        div.textContent = num;
        div.addEventListener("click", () => moveTile(index));
        puzzle.appendChild(div);
    });
}

function moveTile(index) {
    const emptyIndex = tiles.indexOf("");
    const validMoves = getValidMoves(emptyIndex);

    if (validMoves.includes(index)) {
        [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
        renderPuzzle();
        checkWin();
        // reset A* plan because the puzzle changed
        currentPlan = [];
    }
}

function getValidMoves(emptyIndex) {
    const row = Math.floor(emptyIndex / puzzleSize);
    const col = emptyIndex % puzzleSize;
    let moves = [];
    if (row > 0) moves.push(emptyIndex - puzzleSize);
    if (row < puzzleSize - 1) moves.push(emptyIndex + puzzleSize);
    if (col > 0) moves.push(emptyIndex - 1);
    if (col < puzzleSize - 1) moves.push(emptyIndex + 1);
    return moves;
}

function checkWin() {
    const msg = document.getElementById("puzzleMessage");
    const solved = tiles.slice(0, -1).every((val, i) => val === i + 1);
    msg.textContent = solved ? "🎉 You solved the puzzle!" : "";
}

// Goal check for a single tile
function isTileInPlace(state, tile) {
    return state[tile - 1] === tile;
}

// Compute neighbors for A* (move empty tile)
function getNeighbors(state, lockedTiles) {
    const emptyIndex = state.indexOf("");
    const moves = getValidMoves(emptyIndex);
    const neighbors = [];

    for (const move of moves) {
        const tileToMove = state[move];
        // Skip locked tiles (already solved)
        if (lockedTiles.includes(tileToMove)) continue;

        const newState = [...state];
        [newState[emptyIndex], newState[move]] = [newState[move], newState[emptyIndex]];
        neighbors.push(newState);
    }

    return neighbors;
}

// Heuristic: Manhattan distance of the current tile to its target
function heuristic(state, tile) {
    const index = state.indexOf(tile);
    const row = Math.floor(index / puzzleSize);
    const col = index % puzzleSize;
    const goalRow = Math.floor((tile - 1) / puzzleSize);
    const goalCol = (tile - 1) % puzzleSize;
    return Math.abs(row - goalRow) + Math.abs(col - goalCol);
}

// A* to move a single tile without disturbing solved tiles
function astarSingleTile(start, tile, lockedTiles) {
    const open = [{ state: start, g: 0, f: heuristic(start, tile), path: [] }];
    const seen = new Set();

    while (open.length > 0) {
        open.sort((a, b) => a.f - b.f);
        const current = open.shift();

        if (isTileInPlace(current.state, tile)) {
            return current.path;
        }

        seen.add(current.state.join(","));

        for (const neighbor of getNeighbors(current.state, lockedTiles)) {
            const key = neighbor.join(",");
            if (seen.has(key)) continue;

            const g = current.g + 1;
            open.push({
                state: neighbor,
                g,
                f: g + heuristic(neighbor, tile),
                path: [...current.path, neighbor]
            });
        }
    }

    return null; // no plan found
}

// Goal check for one or more tiles
function areTilesInPlace(state, tiles) {
    for (const tile of tiles) {
        if (state[tile - 1] !== tile) return false;
    }
    return true;
}

// Heuristic: sum of Manhattan distances for all tiles
function heuristicMultiple(state, tiles) {
    let h = 0;
    for (const tile of tiles) {
        const index = state.indexOf(tile);
        const row = Math.floor(index / puzzleSize);
        const col = index % puzzleSize;
        const goalRow = Math.floor((tile - 1) / puzzleSize);
        const goalCol = (tile - 1) % puzzleSize;
        h += Math.abs(row - goalRow) + Math.abs(col - goalCol);
    }
    return h;
}

// A* for multiple tiles
function astarMultipleTiles(start, tilesToMove, lockedTiles) {
    const open = [{ state: start, g: 0, f: heuristicMultiple(start, tilesToMove), path: [] }];
    const seen = new Set();

    while (open.length > 0) {
        open.sort((a, b) => a.f - b.f);
        const current = open.shift();

        if (areTilesInPlace(current.state, tilesToMove)) return current.path;

        seen.add(current.state.join(","));

        for (const neighbor of getNeighbors(current.state, lockedTiles)) {
            const key = neighbor.join(",");
            if (seen.has(key)) continue;

            const g = current.g + 1;
            open.push({
                state: neighbor,
                g,
                f: g + heuristicMultiple(neighbor, tilesToMove),
                path: [...current.path, neighbor]
            });
        }
    }
    return null;
}

// Step hint: execute one move from the current plan
let solvedTiles = [];

function stepHint() {
    if (nextHintTile > 15) return;

    let tilesToMove;

    // Grouping logic
    if (nextHintTile <= 2) {
        tilesToMove = [nextHintTile];       // 1,2
    } else if (nextHintTile === 3) {
        tilesToMove = [3, 4];               // 3,4 together
    } else if (nextHintTile === 5) {
        tilesToMove = [5];                  // 5 alone
    } else if (nextHintTile === 6) {
        tilesToMove = [6];                  // 6 alone
    } else if (nextHintTile === 7) {
        tilesToMove = [7, 8];               // 7,8 together
    } else {
        tilesToMove = [9, 10,11,12,13,14,15];       // remaining tiles individually
    }

    const lockedTiles = [...Array(nextHintTile - 1).keys()].map(i => i + 1);
    console.log(tilesToMove)
    if (currentPlan.length === 0) {
        currentPlan = astarMultipleTiles(tiles, tilesToMove, lockedTiles) || [];
    }
    console.log(tilesToMove)

    if (currentPlan.length > 0) {
        tiles = currentPlan.shift();
        renderPuzzle();
    }
    console.log(tilesToMove)

    // Check if current tiles are in place
    if (areTilesInPlace(tiles, tilesToMove)) {
        nextHintTile += tilesToMove.length;
        currentPlan = [];
    }
}

// Hook up hint button
document.getElementById("hintPuzzleBtn").addEventListener("click", stepHint);
