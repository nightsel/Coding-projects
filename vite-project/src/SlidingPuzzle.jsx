
  import React, { useState } from "react";
  import {
    puzzleSize,
    astarMultipleTilesDebug,
    areTilesInPlace,
    getNeighbors,
  } from "./astar";

  export default function SlidingPuzzle() {
    const [tiles, setTiles] = useState(shuffleSolvable);
    const [nextHintTile, setNextHintTile] = useState(1);
    const [currentPlan, setCurrentPlan] = useState([]);
    const [winMessage, setWinMessage] = useState("");

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
          // Found a group that still needs solving
          return { nextHintTile, tilesToMove };
        }

        // Whole group already in place → skip ahead
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
        setCurrentPlan([]); // discard old path if user moves manually
        checkWin(newTiles);
      }
    };

    // Check if solved
    const checkWin = (state = tiles) => {
      if (state.slice(0, -1).every((val, i) => val === i + 1)) {
        setWinMessage("🎉 You solved the puzzle!");
      } else {
        setWinMessage(""); // clear message if puzzle is not solved
      }
    };

    // Hint logic
    const stepHint = () => {
      const { nextHintTile: updatedHintTile, tilesToMove } = advanceToNextUnsolvedGroup(tiles, nextHintTile);
      if (updatedHintTile !== nextHintTile) {
        setNextHintTile(updatedHintTile);
        setCurrentPlan([]);
      }
  //  let tilesToMove = groupTiles; // now use this below

  if (nextHintTile > 15) return;

  // --- Figure out which tiles need to move ---
  /*let tilesToMove;
  if (nextHintTile === 3) tilesToMove = [3, 4];
  else if (nextHintTile === 5) tilesToMove = [5, 6];
  else if (nextHintTile === 7) tilesToMove = [7, 8];
  else if (nextHintTile === 9) tilesToMove = [9, 10, 11, 12, 13, 14, 15];
  else tilesToMove = [nextHintTile];*/

  let lockedTiles = [...Array(updatedHintTile - 1).keys()].map((i) => i + 1);


  // If everything already solved → nothing to do
  if (tilesToMove.length === 0) return;

  let plan = currentPlan;

  // --- Generate a plan if we don’t have one ---
  if (!plan || plan.length === 0) {
    plan = astarMultipleTilesDebug(tiles, tilesToMove, lockedTiles) || [];
  }

  if (!plan || plan.length === 0) return; // still nothing? just stop

  // --- Execute one step from the plan ---
  const [nextStep, ...rest] = plan;
  setTiles(nextStep);
  setCurrentPlan(rest);

  // --- If we solved this chunk, reset for next hint ---
  if (areTilesInPlace(nextStep, tilesToMove)) {
    setNextHintTile((prev) => prev + tilesToMove.length);
    setCurrentPlan([]);
  }

  checkWin(nextStep);
};




    return (
      <div>
        <button onClick={resetPuzzle} style={{ marginBottom: "10px" }}>
          Reset Puzzle
        </button>
        <button onClick={stepHint} style={{ marginBottom: "10px", marginLeft: "10px" }}>
          Hint
        </button>
        <div style={{ marginTop: "10px", fontWeight: "bold", color: "green" }}>
          {winMessage}
        </div>

        <div
          id="puzzle"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${puzzleSize}, 60px)`,
            gap: "5px",
            marginTop: "10px",
          }}
        >
          {tiles.map((t, i) => (
            <div
              key={i}
              className={t === "" ? "tile empty" : "tile"}
              style={{
                width: "60px",
                height: "60px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: t === "" ? "#eee" : "#ccc",
                border: "1px solid #999",
                fontWeight: "bold",
                cursor: t === "" ? "default" : "pointer",
              }}
              onClick={() => moveTile(i)}
            >
              {t}
            </div>
          ))}
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
