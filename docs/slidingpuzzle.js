// working version for solving 1
const puzzleSize = 4;
let tiles = [];
let nextHintTile = 1; // starts with tile 1

// Initialize puzzle
function initSlidingPuzzle() {
    const puzzle = document.getElementById("puzzle");
    const resetBtn = document.getElementById("resetPuzzleBtn");
    const msg = document.getElementById("puzzleMessage");

    if (!puzzle) return;

    puzzle.innerHTML = "";
    msg.textContent = "";

    // Generate shuffled numbers 1..15 + empty
    tiles = [...Array(puzzleSize * puzzleSize).keys()].slice(1);
    tiles.push(""); // empty slot
    tiles.sort(() => Math.random() - 0.5);

    renderPuzzle();

    // hook up reset button
    resetBtn.onclick = initSlidingPuzzle;
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
        // swap tile with empty

        [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];

        renderPuzzle();
        checkWin();
    }
}

function getValidMoves(emptyIndex) {
    const row = Math.floor(emptyIndex / puzzleSize);
    const col = emptyIndex % puzzleSize;
    let moves = [];

    if (row > 0) moves.push(emptyIndex - puzzleSize);     // up
    if (row < puzzleSize - 1) moves.push(emptyIndex + puzzleSize); // down
    if (col > 0) moves.push(emptyIndex - 1);              // left
    if (col < puzzleSize - 1) moves.push(emptyIndex + 1); // right
    console.log(moves)
    return moves;
}

function checkWin() {
    const msg = document.getElementById("puzzleMessage");
    const solved = tiles.slice(0, -1).every((val, i) => val === i + 1);

    if (solved) {
        msg.textContent = "🎉 You solved the puzzle!";
    } else {
        msg.textContent = "";
    }
}

function getHintTile() {
    const emptyIndex = tiles.indexOf(""); // empty tile
    const oneIndex = tiles.indexOf(1);    // tile "1"

    if (oneIndex === 0) return null; // 1 already in top-left

    const emptyRow = Math.floor(emptyIndex / puzzleSize);
    const emptyCol = emptyIndex % puzzleSize;
    const oneRow = Math.floor(oneIndex / puzzleSize);
    const oneCol = oneIndex % puzzleSize;

    // Determine target empty position for 1 to move
    let targetRow, targetCol;

    if (oneRow > 0) {
        // Need empty above 1
        targetRow = oneRow - 1;
        targetCol = oneCol;
    } else if (oneCol > 0) {
        // 1 is in top row, need empty to left
        targetRow = oneRow;
        targetCol = oneCol - 1;
    } else {
        return null; // 1 is in place
    }

    const targetIndex = targetRow * puzzleSize + targetCol;
    // Check if empty is below 1
    if (emptyRow > oneRow && emptyCol === oneCol) {
        // Move a tile adjacent to empty instead of 1
        const moves = getValidMoves(emptyIndex); // tiles adjacent to empty
        // Prefer a side tile (not 1) if possible
        const sideMoves = moves.filter(idx => idx !== oneIndex);
        if (sideMoves.length > 0) {
            return sideMoves[0]; // pick first side tile
        } else {
            return moves[0]; // fallback
        }
    }

    // If empty is already in target, move 1
    if (emptyIndex === targetIndex) return oneIndex;

    // Otherwise, move a tile adjacent to empty toward the target
    const moves = getValidMoves(emptyIndex); // indices of tiles that can move into empty
    let bestMove = moves[0];
    let bestDist = Math.abs((bestMove % puzzleSize) - targetCol) + Math.abs(Math.floor(bestMove / puzzleSize) - targetRow);

    for (const idx of moves) {
        const dist = Math.abs((idx % puzzleSize) - targetCol) + Math.abs(Math.floor(idx / puzzleSize) - targetRow);
        if (dist < bestDist) {
            bestDist = dist;
            bestMove = idx;
        }
    }

    return bestMove;
}

function moveEmptyAboveTile(tileValue) {
    const emptyIndex = tiles.indexOf("");
    const targetIndex = tiles.indexOf(tileValue);

    const emptyRow = Math.floor(emptyIndex / puzzleSize);
    const emptyCol = emptyIndex % puzzleSize;
    const targetRow = Math.floor(targetIndex / puzzleSize);
    const targetCol = targetIndex % puzzleSize;

    // If empty is already above, do nothing
    if (emptyRow === targetRow - 1 && emptyCol === targetCol) return;

    // Simple moves: move empty vertically first
    if (emptyRow < targetRow - 1) moveTile(emptyIndex + puzzleSize);
    else if (emptyRow > targetRow - 1) moveTile(emptyIndex - puzzleSize);

    // Then move horizontally
    else if (emptyCol < targetCol) moveTile(emptyIndex + 1);
    else if (emptyCol > targetCol) moveTile(emptyIndex - 1);
}

// tiles: 1D array representing puzzle ("" = empty)
// puzzleSize: 4 for 4x4 puzzle
// targetIndex: index of the tile we want to move (e.g., 1)
// preferredPos: "above" or "left" of target
function moveEmptyAboveTarget(targetValue) {
    const targetIndex = tiles.indexOf(targetValue);
    const emptyIndex = tiles.indexOf("");

    const targetRow = Math.floor(targetIndex / puzzleSize);
    const targetCol = targetIndex % puzzleSize;
    let emptyRow = Math.floor(emptyIndex / puzzleSize);
    let emptyCol = emptyIndex % puzzleSize;

    // If empty already above, nothing to do
    if (emptyRow === targetRow - 1 && emptyCol === targetCol) return;


    // Determine next move for empty, avoiding moving the target
    let moveIndex = null;


      // Logic: If starting below 1 in rows, then
      // move to left side of 1 if possible. If not possible, move to right.
      // Then adjust position until 1 row above targetIndex. Then move above
      // targetIndex.

    if (targetRow != 0) {
      if (emptyRow > targetRow) {
        if (emptyCol > targetCol + 1)  {
          moveIndex = emptyIndex - 1;
        }
        else if (emptyCol < targetCol -1) {
          moveIndex = emptyIndex + 1;
        }
        else if (emptyCol == targetCol && emptyCol > 0) {
          moveIndex = emptyIndex - 1;
        }
        else if (emptyCol == targetCol && emptyCol < puzzleSize-1) {
          moveIndex = emptyIndex + 1;
        }
        else {
          moveIndex = emptyIndex - puzzleSize;
        }
      }
      else {
        if (emptyRow == targetRow && targetCol -1 == emptyCol) {
          moveIndex = emptyIndex + 1;
        }
        else if (emptyRow == targetRow -1 && targetCol > emptyCol ) {
          moveIndex = emptyIndex + 1;
        }
        else if (emptyRow == targetRow -1 && targetCol < emptyCol ) {
          moveIndex = emptyIndex - 1;
        }
        else if (emptyRow == targetRow && targetCol != emptyCol) {
          moveIndex = emptyIndex - puzzleSize;
        }
        else if (targetCol < emptyCol) {
          moveIndex = emptyIndex -1;
        }
        else if (targetCol > emptyCol) {
          moveIndex = emptyIndex +1;
        }
        else if (targetCol == emptyCol) {
          moveIndex = emptyIndex +puzzleSize;
        }
      }
    }
    else {
      if (emptyCol == targetCol - 1 && emptyRow == targetRow) {
        moveIndex = targetIndex;
      }
      else if (emptyRow > targetRow && emptyCol > targetCol - 1) {
        moveIndex = emptyIndex - 1;
      }
      else if (emptyRow > targetRow && emptyCol < targetCol - 1) {
        moveIndex = emptyIndex + 1;
      }
      else if (emptyCol == targetCol - 1) {
        moveIndex = emptyIndex - puzzleSize;
      }
      else if (emptyRow == targetRow) {
        moveIndex = emptyIndex + puzzleSize;
      }
  }


/*
    if (emptyCol < targetCol && emptyIndex !== targetIndex - 1)
      {moveIndex = emptyIndex + 1;}
    else if (emptyCol > targetCol && emptyIndex !== targetIndex + 1)
       {moveIndex = emptyIndex - 1;}
    // Then vertical moves
    else if (emptyRow < targetRow - 1)
             {console.log('why')
             moveIndex = emptyIndex + puzzleSize;}
    else if (emptyRow > targetRow - 1)
               {console.log('why2')
                 moveIndex = emptyIndex - puzzleSize;
               }
               */

    console.log(moveIndex)

    // Perform the move if valid
    if (moveIndex !== null) {
        [tiles[emptyIndex], tiles[moveIndex]] = [tiles[moveIndex], tiles[emptyIndex]];
        renderPuzzle();
    }
}

function moveEmptyLeftTarget(targetValue) {
    const targetIndex = tiles.indexOf(targetValue);
    const emptyIndex = tiles.indexOf("");

    const targetRow = Math.floor(targetIndex / puzzleSize);
    const targetCol = targetIndex % puzzleSize;
    let emptyRow = Math.floor(emptyIndex / puzzleSize);
    let emptyCol = emptyIndex % puzzleSize;

    // If empty already to the left, nothing to do
    if (emptyRow === targetRow && emptyCol === targetCol - 1) return;

    let moveIndex = null;

    // Vertical moves first to line up with target row
    if (emptyRow < targetRow && emptyIndex !== targetIndex - puzzleSize)
        moveIndex = emptyIndex + puzzleSize; // move empty down
    else if (emptyRow > targetRow && emptyIndex !== targetIndex + puzzleSize)
        moveIndex = emptyIndex - puzzleSize; // move empty up
    // Then horizontal moves to get left of target
    else if (emptyCol < targetCol - 1)
        moveIndex = emptyIndex + 1; // move empty right
    else if (emptyCol > targetCol - 1)
        moveIndex = emptyIndex - 1; // move empty left

    // Perform the move if valid
    if (moveIndex !== null) {
        [tiles[emptyIndex], tiles[moveIndex]] = [tiles[moveIndex], tiles[emptyIndex]];
        renderPuzzle();
    } else {
        // fallback: if no move found, you can optionally try other moves
        const moves = getValidMoves(emptyIndex).filter(idx => idx !== targetIndex);
        if (moves.length > 0) {
            [tiles[emptyIndex], tiles[moves[0]]] = [tiles[moves[0]], tiles[emptyIndex]];
            renderPuzzle();
        }
    }
}

// Hint step for tile 1
function stepHint() {
    const target = 1;
    const targetIndex = tiles.indexOf(target);
    const emptyIndex = tiles.indexOf("");

    const targetRow = Math.floor(targetIndex / puzzleSize);
    const targetCol = targetIndex % puzzleSize;
    const emptyRow = Math.floor(emptyIndex / puzzleSize);
    const emptyCol = emptyIndex % puzzleSize;
    console.log(((emptyRow === targetRow - 1) &&  (emptyCol === targetCol)))
    if ((emptyRow === targetRow - 1) &&  (emptyCol === targetCol)){
        // Empty is correctly positioned, move target
        moveTile(targetIndex);
    } else {
        // Move empty above target
        moveEmptyAboveTarget(target);
    }
}



// Hint button event
document.getElementById("hintPuzzleBtn").addEventListener("click", stepHint);
