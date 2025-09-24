import React, { useState, useEffect } from "react";

const puzzleSize = 4;

export default function SlidingPuzzle() {
  const [tiles, setTiles] = useState([]);
  const [nextHintTile, setNextHintTile] = useState(1);
  const [currentPlan, setCurrentPlan] = useState([]);
  const [message, setMessage] = useState("");

  // Initialize puzzle
  const initSlidingPuzzle = () => {
    const shuffled = shuffleSolvable();
    setTiles(shuffled);
    setNextHintTile(1);
    setCurrentPlan([]);
    setMessage("");
  };

  useEffect(() => {
    initSlidingPuzzle();
  }, []);

  // Shuffle until solvable
  const shuffleSolvable = () => {
    let arr = [...Array(puzzleSize * puzzleSize).keys()].slice(1);
    arr.push("");
    do {
      arr.sort(() => Math.random() - 0.5);
    } while (!isSolvable(arr));
    return arr;
  };

  const isSolvable = (puzzle) => {
    let inversions = 0;
    const tilesArr = puzzle.filter((t) => t !== "");
    for (let i = 0; i < tilesArr.length; i++) {
      for (let j = i + 1; j < tilesArr.length; j++) {
        if (tilesArr[i] > tilesArr[j]) inversions++;
      }
    }
    const emptyRowFromBottom = puzzleSize - Math.floor(puzzle.indexOf("") / puzzleSize);
    if (puzzleSize % 2 === 0) {
      return (
        (emptyRowFromBottom % 2 === 0 && inversions % 2 === 1) ||
        (emptyRowFromBottom % 2 === 1 && inversions % 2 === 0)
      );
    } else {
      return inversions % 2 === 0;
    }
  };

  const moveTile = (index) => {
    const emptyIndex = tiles.indexOf("");
    const validMoves = getValidMoves(emptyIndex);
    if (validMoves.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setCurrentPlan([]);
      checkWin(newTiles);
    }
  };

  const getValidMoves = (emptyIndex) => {
    const row = Math.floor(emptyIndex / puzzleSize);
    const col = emptyIndex % puzzleSize;
    const moves = [];
    if (row > 0) moves.push(emptyIndex - puzzleSize);
    if (row < puzzleSize - 1) moves.push(emptyIndex + puzzleSize);
    if (col > 0) moves.push(emptyIndex - 1);
    if (col < puzzleSize - 1) moves.push(emptyIndex + 1);
    return moves;
  };

  const checkWin = (tilesToCheck) => {
    const solved = tilesToCheck.slice(0, -1).every((val, i) => val === i + 1);
    setMessage(solved ? "🎉 You solved the puzzle!" : "");
  };

  // Helper for A* (neighbors)
  const getNeighbors = (state, lockedTiles) => {
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
  };

  const heuristicMultiple = (state, tilesArr) => {
    return tilesArr.reduce((sum, t) => {
      const index = state.indexOf(t);
      const row = Math.floor(index / puzzleSize);
      const col = index % puzzleSize;
      const goalRow = Math.floor((t - 1) / puzzleSize);
      const goalCol = (t - 1) % puzzleSize;
      return sum + Math.abs(row - goalRow) + Math.abs(col - goalCol);
    }, 0);
  };

  const areTilesInPlace = (state, tileArr) => tileArr.every((t) => state[t - 1] === t);

  const astarMultipleTiles = (start, tilesToMove, lockedTiles) => {
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
        open.push({
          state: neighbor,
          g: current.g + 1,
          f: current.g + 1 + heuristicMultiple(neighbor, tilesToMove),
          path: [...current.path, neighbor],
        });
      }
    }
    return [];
  };

  // Step hint
  const stepHint = () => {
    if (nextHintTile > 15) return;

    const lockedTiles = [...Array(nextHintTile - 1).keys()].map((i) => i + 1);
    let tilesToMove;

    if (nextHintTile === 3) tilesToMove = [3, 4];
    else if (nextHintTile === 5) tilesToMove = [5, 6];
    else if (nextHintTile === 7) tilesToMove = [7, 8];
    else if (nextHintTile === 9) tilesToMove = [9, 10, 11, 12, 13, 14, 15];
    else tilesToMove = [nextHintTile];

    let plan = [...currentPlan];
    if (plan.length === 0) {
      plan = astarMultipleTiles(tiles, tilesToMove, lockedTiles);
      setCurrentPlan(plan);
    }

    if (plan.length > 0) {
      const nextStep = plan.shift();
      setTiles(nextStep);
      setCurrentPlan(plan);
      if (areTilesInPlace(nextStep, tilesToMove)) setNextHintTile(nextHintTile + tilesToMove.length);
      checkWin(nextStep);
    }
  };

  return (
    <div>
      <h3>Sliding Puzzle</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${puzzleSize}, 100px)`,
          gridGap: "5px",
          marginBottom: "10px",
        }}
      >
        {tiles.map((num, index) => (
          <div
            key={index}
            onClick={() => moveTile(index)}
            style={{
              width: "100px",
              height: "100px",
              backgroundColor: num === "" ? "#ecf0f1" : "#3498db",
              color: num === "" ? "black" : "white",
              fontSize: "2em",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            {num}
          </div>
        ))}
      </div>
      <button onClick={initSlidingPuzzle}>Reset Puzzle</button>{" "}
      <button onClick={stepHint}>Hint</button>
      <p>{message}</p>
    </div>
  );
}
