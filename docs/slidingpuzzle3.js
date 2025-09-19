const puzzleSize = 4;
let tiles = [];
let nextHintTile = 1;
let currentPlan = [];

// Initialize puzzle
function initSlidingPuzzle() {
    const puzzle = document.getElementById("puzzle");
    const resetBtn = document.getElementById("resetPuzzleBtn");
    const msg = document.getElementById("puzzleMessage");

    if (!puzzle) return;

    puzzle.innerHTML = "";
    msg.textContent = "";

    tiles = shuffleSolvable();
    renderPuzzle();
    nextHintTile = 1;
    currentPlan = [];

    resetBtn.onclick = initSlidingPuzzle;
}

// Shuffle until solvable
function shuffleSolvable() {
    let arr = [...Array(puzzleSize * puzzleSize).keys()].slice(1);
    arr.push("");
    do {
        arr.sort(() => Math.random() - 0.5);
    } while (!isSolvable(arr));
    return arr;
}

// Check solvability
function isSolvable(puzzle) {
    const N = puzzleSize;
    let inversions = 0;
    const tilesArr = puzzle.filter(t => t !== "");

    for (let i = 0; i < tilesArr.length; i++) {
        for (let j = i + 1; j < tilesArr.length; j++) {
            if (tilesArr[i] > tilesArr[j]) inversions++;
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

// Render puzzle
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

// Move tile if adjacent to empty
function moveTile(index) {
    const emptyIndex = tiles.indexOf("");
    const validMoves = getValidMoves(emptyIndex);

    if (validMoves.includes(index)) {
        [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
        renderPuzzle();
        checkWin();
        currentPlan = []; // reset A* plan
    }
}

// Valid moves for empty
function getValidMoves(emptyIndex) {
    const row = Math.floor(emptyIndex / puzzleSize);
    const col = emptyIndex % puzzleSize;
    const moves = [];
    if (row > 0) moves.push(emptyIndex - puzzleSize);
    if (row < puzzleSize - 1) moves.push(emptyIndex + puzzleSize);
    if (col > 0) moves.push(emptyIndex - 1);
    if (col < puzzleSize - 1) moves.push(emptyIndex + 1);
    return moves;
}

// Check win
function checkWin() {
    const msg = document.getElementById("puzzleMessage");
    const solved = tiles.slice(0, -1).every((val, i) => val === i + 1);
    msg.textContent = solved ? "🎉 You solved the puzzle!" : "";
}

// Goal check for one or more tiles
function isTileInPlace(state, tile) {
    return state[tile - 1] === tile;
}
function areTilesInPlace(state, tileArr) {
    return tileArr.every(t => isTileInPlace(state, t));
}

// A* helpers
function getNeighbors(state, lockedTiles) {
    const emptyIndex = state.indexOf("");
    const moves = getValidMoves(emptyIndex);
    const neighbors = [];

    for (const move of moves) {
        const tileToMove = state[move];
        if (lockedTiles.includes(tileToMove)) continue;

        const newState = [...state];
        [newState[emptyIndex], newState[move]] = [newState[move], newState[emptyIndex]];
        neighbors.push(newState);
    }

    return neighbors;
}

function heuristic(state, tile) {
    const index = state.indexOf(tile);
    const row = Math.floor(index / puzzleSize);
    const col = index % puzzleSize;
    const goalRow = Math.floor((tile - 1) / puzzleSize);
    const goalCol = (tile - 1) % puzzleSize;
    return Math.abs(row - goalRow) + Math.abs(col - goalCol);
}

function heuristicMultiple(state, tilesArr) {
    return tilesArr.reduce((sum, t) => sum + heuristic(state, t), 0);
}

function heuristicWeighted(state, tilesArr) {
    let h = 0;
    for (const t of tilesArr) {
        const index = state.indexOf(t);
        const row = Math.floor(index / puzzleSize);
        const col = index % puzzleSize;
        const goalRow = Math.floor((t - 1) / puzzleSize);
        const goalCol = (t - 1) % puzzleSize;

        // Add weight: tile 3 and 4 are more important
        const weight = (t === 3 || t === 4) ? 5 : 1;

        h += weight * (Math.abs(row - goalRow) + Math.abs(col - goalCol));
    }
    return h;
}

function heuristicSoftBias(state, tilesArr) {
    let h = 0;
    for (const t of tilesArr) {
        const index = state.indexOf(t);
        const row = Math.floor(index / puzzleSize);
        const col = index % puzzleSize;
        const goalRow = Math.floor((t - 1) / puzzleSize);
        const goalCol = (t - 1) % puzzleSize;

        const manhattan = Math.abs(row - goalRow) + Math.abs(col - goalCol);

        // If tile is 2 or fewer steps away from goal, apply bonus to moves toward goal
        if (t === 3 || t === 4) {
            if (manhattan <= 2) {
                h += manhattan / 2; // reduces the heuristic, making these moves more attractive
            } else {
                h += manhattan;
            }
        } else {
            h += manhattan;
        }
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
            open.push({ state: neighbor, g, f:  heuristicMultiple(neighbor, tilesToMove), path: [...current.path, neighbor] });
        }
    }

    return null;
}

function astarMultipleTiles(start, tilesToMove, lockedTiles) {
    const startH = heuristicMultiple(start, tilesToMove); // initial h
    const open = [{ state: start, g: 0, f: heuristicMultiple(start, tilesToMove), path: [] }];
    const seen = new Set();

    while (open.length > 0) {
        open.sort((a, b) => a.f - b.f);
        const current = open.shift();
        const key = current.state.join(",");
        if (seen.has(key)) continue;
        seen.add(key);

        const h = heuristicMultiple(current.state, tilesToMove);

        // Early exit if tiles are "close enough"
        if (h <= 2 && startH > 2) {

            return current.path;
        }

        // Full solution check
        if (areTilesInPlace(current.state, tilesToMove)) {
            return current.path;
        }

        for (const neighbor of getNeighbors(current.state, lockedTiles)) {
            const nkey = neighbor.join(",");
            if (seen.has(nkey)) continue;
            const g = current.g + 1;
            const f = g + heuristicMultiple(neighbor, tilesToMove);
            open.push({ state: neighbor, g, f, path: [...current.path, neighbor] });
        }
    }

    return null; // no path found
}

function astarMultipleTilesDebug(start, tilesToMove, lockedTiles, maxSteps = 10000) {
    const open = [{ state: start, g: 0, f: heuristicSoftBias(start, tilesToMove), path: [] }];
    const seen = new Set();
    let steps = 0;

    while (open.length > 0 && steps < maxSteps) {
        steps++;
        open.sort((a, b) => a.f - b.f);
        const current = open.shift();
        const key = current.state.join(",");
        if (seen.has(key)) continue;
        seen.add(key);

        // Debug: print heuristic progress
        const h = heuristicSoftBias(current.state, tilesToMove);
        console.log(`Step ${steps}: h = ${h}, g = ${current.g}, f = ${current.f}`);

        if (areTilesInPlace(current.state, tilesToMove)) {
            console.log(`Solved in ${steps} steps`);
            return current.path;
        }

        for (const neighbor of getNeighbors(current.state, lockedTiles)) {
            const nkey = neighbor.join(",");
            if (seen.has(nkey)) continue;
            const g = current.g + 1;
            open.push({
                state: neighbor,
                g,
                f:  heuristicSoftBias(neighbor, tilesToMove),
                path: [...current.path, neighbor]
            });
        }
    }

    console.log("Reached max steps without full solution");
    return null;
}

function heuristicFinalPosition(state, tilesArr) {
    let h = 0;
    for (const t of tilesArr) {
        const index = state.indexOf(t);
        const row = Math.floor(index / puzzleSize);
        const col = index % puzzleSize;
        const goalRow = Math.floor((t - 1) / puzzleSize);
        const goalCol = (t - 1) % puzzleSize;

        // Large bonus if tile is in its goal row/col
        const inRow = row === goalRow ? 0 : 1;
        const inCol = col === goalCol ? 0 : 1;

        h += inRow + inCol; // just counts how far from target cell
    }
    return h;
}


// Step hint
let iterationCount = 0;
function stepHint() {

    if (nextHintTile > 15) return;

    const lockedTiles = [...Array(nextHintTile - 1).keys()].map(i => i + 1);
    let tilesToMove;

    // Decide groupings
    if (nextHintTile === 3) {
      tilesToMove = [3, 4];
    }

    else if (nextHintTile === 5) tilesToMove = [5, 6];
    else if (nextHintTile === 7) tilesToMove = [7, 8];
    else if (nextHintTile == 9) tilesToMove = [9,10,11,12,13,14,15];
    else tilesToMove = [nextHintTile];

    if (currentPlan.length === 0) {
        iterationCount = 0;
        if (nextHintTile === 3) {
          const h = heuristicMultiple(tiles, tilesToMove);

          // If close enough, move them toward goal directly
        }
        currentPlan = astarMultipleTiles(tiles, tilesToMove, lockedTiles) || [];
    }

    iterationCount++;

    if (currentPlan.length > 0) {
        tiles = currentPlan.shift();

        renderPuzzle();
        checkWin();
    }

    if (areTilesInPlace(tiles, tilesToMove)) {
        nextHintTile += tilesToMove.length;
        currentPlan = [];
        iterationCount = 0;
        checkWin();
    }
}

// Hook up hint button
document.getElementById("hintPuzzleBtn").addEventListener("click", stepHint);
