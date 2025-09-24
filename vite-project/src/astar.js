// This code is separate from jsx because the algorithm is complex enough for it to be messy otherwise.
export const puzzleSize = 4;

export function getValidMoves(emptyIndex) {
  const row = Math.floor(emptyIndex / puzzleSize);
  const col = emptyIndex % puzzleSize;
  const moves = [];
  if (row > 0) moves.push(emptyIndex - puzzleSize);
  if (row < puzzleSize - 1) moves.push(emptyIndex + puzzleSize);
  if (col > 0) moves.push(emptyIndex - 1);
  if (col < puzzleSize - 1) moves.push(emptyIndex + 1);
  return moves;
}

export function getNeighbors(state, lockedTiles) {
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

export function heuristicMultiple(state, tilesArr) {
  return tilesArr.reduce((sum, t) => {
    const index = state.indexOf(t);
    const row = Math.floor(index / puzzleSize);
    const col = index % puzzleSize;
    const goalRow = Math.floor((t - 1) / puzzleSize);
    const goalCol = (t - 1) % puzzleSize;
    return sum + Math.abs(row - goalRow) + Math.abs(col - goalCol);
  }, 0);
}

export function areTilesInPlace(state, tileArr) {
  return tileArr.every(t => state[t - 1] === t);
}

export function astarMultipleTiles(start, tilesToMove, lockedTiles) {
  const open = [{ state: start, g: 0, f: heuristicMultiple(start, tilesToMove), path: [] }];
  const seen = new Set();

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift();
    const key = current.state.join(",");
    if (seen.has(key)) continue;
    seen.add(key);

    if (areTilesInPlace(current.state, tilesToMove)) return current.path;

    for (const neighbor of getNeighbors(current.state, lockedTiles)) {
      const nkey = neighbor.join(",");
      if (seen.has(nkey)) continue;
      const g = current.g + 1;
      const f = g + heuristicMultiple(neighbor, tilesToMove);
      open.push({ state: neighbor, g, f, path: [...current.path, neighbor] });
    }
  }
  return null;
}

export function astarMultipleTilesDebug(start, tilesToMove, lockedTiles, maxSteps = 10000) {
  const open = [{ state: start, g: 0, f: heuristicSoftBias(start, tilesToMove), path: [] }];
  const seen = new Set();
  let steps = 0;

  let bestSoFar = { state: start, path: [], h: heuristicSoftBias(start, tilesToMove) };

  while (open.length > 0 && steps < maxSteps) {
    steps++;
    open.sort((a, b) => a.f - b.f);
    const current = open.shift();
    const key = current.state.join(",");
    if (seen.has(key)) continue;
    seen.add(key);

    const h = heuristicSoftBias(current.state, tilesToMove);

    // Update best-so-far if closer
    if (h < bestSoFar.h) bestSoFar = { state: current.state, path: current.path, h };

    // Return full solution if solved
    if (areTilesInPlace(current.state, tilesToMove)) {
      return current.path;
    }

    for (const neighbor of getNeighbors(current.state, lockedTiles)) {
      const nkey = neighbor.join(",");
      if (seen.has(nkey)) continue;
      const g = current.g + 1;
      open.push({
        state: neighbor,
        g,
        f: g + heuristicSoftBias(neighbor, tilesToMove),
        path: [...current.path, neighbor]
      });
    }
  }

  console.log("Max steps reached, returning best-so-far path");
  return bestSoFar.path;
}
