import React, { useState, useEffect, useRef } from "react";
import {
  puzzleSize,
  astarMultipleTilesDebug,
  areTilesInPlace,
  getNeighbors,
} from "./astar";

export default function SlidingPuzzle() {
  // --- Load from localStorage or start fresh ---
  const [tiles, setTiles] = useState(() => {
    const saved = localStorage.getItem("slidingTiles");
    return saved ? JSON.parse(saved) : shuffleSolvable();
  });
  const [nextHintTile, setNextHintTile] = useState(() => {
    const saved = localStorage.getItem("slidingNextHintTile");
    return saved ? JSON.parse(saved) : 1;
  });
  const [currentPlan, setCurrentPlan] = useState([]);
  const [winMessage, setWinMessage] = useState("");

  // --- Timer state ---
  const [seconds, setSeconds] = useState(() => {
    const saved = localStorage.getItem("slidingTime");
    return saved ? parseInt(saved) : 0;
  });
  const timerRef = useRef(null);

  // --- Timer logic ---
  useEffect(() => {
    if (winMessage) return; // stop timer if solved
    timerRef.current = setInterval(() => setSeconds(prev => prev + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [winMessage]);

  // --- Save progress whenever tiles or hint state changes ---
  useEffect(() => {
    localStorage.setItem("slidingTiles", JSON.stringify(tiles));
    localStorage.setItem("slidingNextHintTile", JSON.stringify(nextHintTile));
    localStorage.setItem("slidingTime", seconds.toString());
  }, [tiles, nextHintTile, seconds]);

  function shuffleSolvable() {
    let arr = [...Array(puzzleSize * puzzleSize).keys()].slice(1);
    arr.push("");
    do {
      arr.sort(() => Math.random() - 0.5);
    } while (!isSolvable(arr));
    return arr;
  }

  function advanceToNextUnsolvedGroup(tiles, nextHintTile) {
    while (nextHintTile < 16) {
      let tilesToMove;
      if (nextHintTile === 3) tilesToMove = [3, 4];
      else if (nextHintTile === 5) tilesToMove = [5, 6];
      else if (nextHintTile === 7) tilesToMove = [7, 8];
      else if (nextHintTile === 9) tilesToMove = [9, 10, 11, 12, 13, 14, 15];
      else tilesToMove = [nextHintTile];

      if (!areTilesInPlace(tiles, tilesToMove)) {
        return { nextHintTile, tilesToMove };
      }

      nextHintTile += tilesToMove.length;
    }

    return { nextHintTile: 16, tilesToMove: [] }; // puzzle solved
  }

  // Shuffle puzzle
  const resetPuzzle = () => {
    let arr;
    do {
      arr = [...Array(puzzleSize * puzzleSize).keys()].slice(1);
      arr.push("");
      arr.sort(() => Math.random() - 0.5);
    } while (!isSolvable(arr));
    setTiles(arr);
    setNextHintTile(1);
    setCurrentPlan([]);
    setWinMessage("");
    setSeconds(0); // reset timer
  };

  // Move tile manually
  const moveTile = (index) => {
    const emptyIndex = tiles.indexOf("");
    const row = Math.floor(emptyIndex / puzzleSize);
    const col = emptyIndex % puzzleSize;
    const validMoves = [];
    if (row > 0) validMoves.push(emptyIndex - puzzleSize);
    if (row < puzzleSize - 1) validMoves.push(emptyIndex + puzzleSize);
    if (col > 0) validMoves.push(emptyIndex - 1);
    if (col < puzzleSize - 1) validMoves.push(emptyIndex + 1);

    if (validMoves.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setCurrentPlan([]);
      checkWin(newTiles);
    }
  };

  // Check if solved
  const checkWin = (state = tiles) => {
    if (state.slice(0, -1).every((val, i) => val === i + 1)) {
      setWinMessage("🎉 You solved the puzzle!");
      clearInterval(timerRef.current); // stop timer
    } else setWinMessage("");
  };

  // Hint logic
  const stepHint = () => {
    const { nextHintTile: updatedHintTile, tilesToMove } = advanceToNextUnsolvedGroup(tiles, nextHintTile);
    if (updatedHintTile !== nextHintTile) {
      setNextHintTile(updatedHintTile);
      setCurrentPlan([]);
    }

    if (nextHintTile > 15) return;

    let lockedTiles = [...Array(updatedHintTile - 1).keys()].map((i) => i + 1);

    if (tilesToMove.length === 0) return;

    let plan = currentPlan;
    if (!plan || plan.length === 0) {
      plan = astarMultipleTilesDebug(tiles, tilesToMove, lockedTiles) || [];
    }

    if (!plan || plan.length === 0) return;

    const [nextStep, ...rest] = plan;
    setTiles(nextStep);
    setCurrentPlan(rest);

    if (areTilesInPlace(nextStep, tilesToMove)) {
      setNextHintTile((prev) => prev + tilesToMove.length);
      setCurrentPlan([]);
    }

    checkWin(nextStep);
  };

  //
  // ---------- ANIMATION: stable render order + transform transition ----------
  //
  const TILE_SIZE = 60;
  const GAP = 5;
  const STEP = TILE_SIZE + GAP;
  // stable order of tile identities: 1..(N-1) then empty string
  const tileOrder = [...Array(puzzleSize * puzzleSize).keys()].map((i) =>
    i === puzzleSize * puzzleSize - 1 ? "" : i + 1
  );
  // map each tile value to its current index (position)
  const positions = {};
  tiles.forEach((tileValue, idx) => {
    positions[tileValue] = idx;
  });

  return (
    <div>
      <h3>Sliding Puzzle</h3>
      <button onClick={resetPuzzle} className="puzzle-button">Reset Puzzle</button>
      <button onClick={stepHint} className="puzzle-button">Hint</button>
      <div style={{ marginTop: "10px" }}>Time: {seconds}s</div>
      <div style={{ color: "green", fontWeight: "bold" }}>{winMessage}</div>

      <div
        id="puzzle"
        style={{
          position: "relative",
          width: `${puzzleSize * STEP - GAP}px`,
          height: `${puzzleSize * STEP - GAP}px`,
          marginTop: "10px",
        }}
      >
        {tileOrder.map((tileId) => {
          const pos = positions[tileId];
          const row = Math.floor(pos / puzzleSize);
          const col = pos % puzzleSize;

          return (
            <div
              key={tileId === "" ? "empty" : tileId}
              onClick={() => tileId !== "" && moveTile(positions[tileId])}
              style={{
                position: "absolute",
                left: 0, // keep at origin, placement is via transform
                top: 0,
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: tileId === "" ? "transparent" : "#ccc",
                border: tileId === "" ? "none" : "1px solid #999",
                fontWeight: "bold",
                cursor: tileId === "" ? "default" : "pointer",

                // THE crucial bit for animation:
                transition: "transform 240ms cubic-bezier(.25,.8,.25,1)",
                transform: `translate(${col * STEP}px, ${row * STEP}px)`,
                willChange: "transform",
                userSelect: "none",
              }}
            >
              {tileId}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper to check solvable
function isSolvable(puzzle) {
  const N = puzzleSize;
  const tilesArr = puzzle.filter((t) => t !== "");
  let inversions = 0;
  for (let i = 0; i < tilesArr.length; i++)
    for (let j = i + 1; j < tilesArr.length; j++)
      if (tilesArr[i] > tilesArr[j]) inversions++;

  const emptyRowFromBottom = N - Math.floor(puzzle.indexOf("") / N);

  if (N % 2 === 0) {
    return (
      (emptyRowFromBottom % 2 === 0 && inversions % 2 === 1) ||
      (emptyRowFromBottom % 2 === 1 && inversions % 2 === 0)
    );
  } else return inversions % 2 === 0;
}
