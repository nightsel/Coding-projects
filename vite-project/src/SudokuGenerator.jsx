import React, { useState, useEffect } from "react";

const gridSize = 9;

export default function Sudoku() {
  const [board, setBoard] = useState([]);
  const [solutionBoard, setSolutionBoard] = useState([]);
  const [difficulty, setDifficulty] = useState("easy");
  const [message, setMessage] = useState("");

  // Initialize empty grid
  const createEmptyGrid = () => Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

  // Shuffle helper
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Check if number can be placed
  const isSafe = (b, row, col, num) => {
    for (let x = 0; x < gridSize; x++) {
      if (b[row][x] === num || b[x][col] === num) return false;
    }
    const startRow = row - (row % 3), startCol = col - (col % 3);
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (b[startRow + i][startCol + j] === num) return false;
    return true;
  };

  // Backtracking solver
  const fillBoard = (b) => {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (b[row][col] === 0) {
          const numbers = shuffle([...Array(9).keys()].map((n) => n + 1));
          for (const num of numbers) {
            if (isSafe(b, row, col, num)) {
              b[row][col] = num;
              if (fillBoard(b)) return true;
              b[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  // Remove numbers for difficulty
  const removeNumbers = (b, difficulty) => {
    let attempts = difficulty === "easy" ? 30 : difficulty === "medium" ? 40 : 50;
    while (attempts > 0) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (b[row][col] !== 0) {
        b[row][col] = 0;
        attempts--;
      }
    }
    return b;
  };

  const generateSudoku = (diff = "easy") => {
    const newBoard = createEmptyGrid();
    fillBoard(newBoard);
    setSolutionBoard(newBoard.map((row) => [...row])); // save solution
    const puzzleBoard = removeNumbers(newBoard.map((row) => [...row]), diff);
    setBoard(puzzleBoard);
    setMessage(`Sudoku (${diff}) generated!`);
  };

  useEffect(() => {
    checkCompletion(board);
  }, [board]);

  useEffect(() => {
  generateSudoku(difficulty); // run once on mount
}, []);

  const handleInputChange = (row, col, value) => {
    const val = parseInt(value);
    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = val || 0;
    setBoard(newBoard);
    checkMistakes(row, col, val);
  };

  const checkMistakes = (row, col, val) => {
    if (!val || val < 1 || val > 9) return;

    if (val !== solutionBoard[row][col]) {
      // color can be handled in render
    }
    checkCompletion();
  };

  const checkCompletion = (b = board) => {
    if (!b || b.length === 0) return; // safety check

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (b[r][c] !== solutionBoard[r][c]) {
          setMessage("");
          return;
        }
      }
    }
    setMessage("🎉 Congratulations! Sudoku completed!");
  };

  const giveHint = () => {
  const emptyCells = [];
  for (let r = 0; r < gridSize; r++)
    for (let c = 0; c < gridSize; c++)
      if (board[r][c] === 0) emptyCells.push([r, c]);
  if (emptyCells.length === 0) return;
  const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newBoard = board.map((row) => [...row]);
  newBoard[r][c] = solutionBoard[r][c];
  setBoard(newBoard);
  checkCompletion(newBoard); // pass updated board
};

  return (
    <div>
      <h3>Sudoku Generator</h3>
      <label>
        Difficulty:
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>
      <button onClick={() => generateSudoku(difficulty)}>Generate Sudoku</button>{" "}
      <button onClick={giveHint}>Give Hint</button>
      <p>{message}</p>
      <table style={{ borderCollapse: "collapse", marginTop: "10px" }}>
        <tbody>
          {board.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((cell, cIdx) => {
                const isPrefilled = solutionBoard[rIdx][cIdx] === cell && cell !== 0;
                const isCorrect = cell === solutionBoard[rIdx][cIdx];
                const color = cell === 0 ? "black" : isPrefilled ? "black" : isCorrect ? "green" : "red";
                return (
                  <td
                    key={cIdx}
                    style={{
                      border: "1px solid black",
                      width: "40px",
                      height: "40px",
                      textAlign: "center",
                    }}
                  >
                    {isPrefilled ? (
                      cell
                    ) : (
                      <input
                        type="text"
                        maxLength="1"
                        style={{
                          width: "100%",
                          height: "100%",
                          fontSize: "20px",
                          textAlign: "center",
                          color,
                        }}
                        value={cell === 0 ? "" : cell}
                        onChange={(e) => handleInputChange(rIdx, cIdx, e.target.value)}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
