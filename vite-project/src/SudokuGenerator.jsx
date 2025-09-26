import React, { useState, useEffect } from "react";

const gridSize = 9;

export const createEmptyGrid = () => Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

export default function Sudoku() {
  const [difficulty, setDifficulty] = useState("easy");
  const [message, setMessage] = useState("");
  const [puzzleBoard, setPuzzleBoard] = useState(() => {
  const savedPuzzle = JSON.parse(localStorage.getItem("sudokuPuzzle"));
  return savedPuzzle || createEmptyGrid(); // don't fill numbers yet
});

const [solutionBoard, setSolutionBoard] = useState(() => {
  const savedSolution = JSON.parse(localStorage.getItem("sudokuSolution"));
  return savedSolution || createEmptyGrid(); // empty initially
});

const [board, setBoard] = useState(() => {
  const savedBoard = JSON.parse(localStorage.getItem("sudokuBoard"));
  return savedBoard || createEmptyGrid(); // user board starts empty
});

const [secondsElapsed, setSecondsElapsed] = useState(() => {
  const saved = localStorage.getItem("sudokuSecondsElapsed");
  return saved ? parseInt(saved, 10) : 0;
});
const [timerActive, setTimerActive] = useState(true);


  // Initialize empty grid

  // Shuffle helper
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Check if number can be placed
  function isSafe(b, row, col, num) {
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
  function fillBoard(b) {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (b[row][col] === 0) {
          const numbers = shuffle([...Array(9).keys()].map(n => n + 1));
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
  }

  // Remove numbers for difficulty
  function removeNumbers(b, difficulty) {
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

  // Recursive solver that counts number of solutions up to 2
  const countSolutions = (b) => {
    let count = 0;

    const solve = (board) => {
      if (count > 1) return; // already more than 1 solution
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (board[r][c] === 0) {
            for (let n = 1; n <= 9; n++) {
              if (isSafe(board, r, c, n)) {
                board[r][c] = n;
                solve(board);
                board[r][c] = 0;
              }
            }
            return;
          }
        }
      }
      count++;
    };

    const copyBoard = b.map((row) => [...row]);
    solve(copyBoard);
    return count;
  };

  const removeNumbersUnique = (b, difficulty) => {
    let attempts = difficulty === "easy" ? 30 : difficulty === "medium" ? 40 : 50;
    while (attempts > 0) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (b[row][col] !== 0) {
        const backup = b[row][col];
        b[row][col] = 0;

        // Only keep removal if puzzle still has exactly 1 solution
        if (countSolutions(b) !== 1) {
          b[row][col] = backup; // revert
        } else {
          attempts--;
        }
      }
    }
    return b;
  };


  const generateSudoku = (diff = "easy") => {
    const newBoard = createEmptyGrid();
    fillBoard(newBoard);

    const newSolution = newBoard.map(row => [...row]);
    setSolutionBoard(newSolution);

    const puzzle = removeNumbers(newBoard.map(row => [...row]), diff);
    setPuzzleBoard(puzzle);
    setBoard(puzzle.map(row => [...row]));

    setMessage(`Sudoku (${diff}) generated!`);

    // 🔑 persist everything
    localStorage.setItem("sudokuPuzzle", JSON.stringify(puzzle));
    localStorage.setItem("sudokuSolution", JSON.stringify(newSolution));
    localStorage.setItem("sudokuBoard", JSON.stringify(puzzle));
    setSecondsElapsed(0);
  setTimerActive(true);

  };



  useEffect(() => {
    checkCompletion(board);
  }, [board]);

  useEffect(() => {
  if (!timerActive) return;
  const interval = setInterval(() => {
    setSecondsElapsed(prev => prev + 1);
  }, 1000);
  return () => clearInterval(interval);
}, [timerActive]);

useEffect(() => {
  localStorage.setItem("sudokuSecondsElapsed", secondsElapsed);
}, [secondsElapsed]);


useEffect(() => {
  localStorage.setItem("sudokuBoard", JSON.stringify(board));
}, [board]);

const [loaded, setLoaded] = useState(false);

useEffect(() => {
  const savedPuzzle = JSON.parse(localStorage.getItem("sudokuPuzzle"));
  const savedSolution = JSON.parse(localStorage.getItem("sudokuSolution"));
  const savedBoard = JSON.parse(localStorage.getItem("sudokuBoard"));


  if (!savedPuzzle || !savedSolution || !savedBoard) {
    const newSolution = createEmptyGrid();
    fillBoard(newSolution);
    const puzzle = removeNumbers(newSolution.map(r => [...r]), difficulty);

    setSolutionBoard(newSolution.map(r => [...r]));
    setPuzzleBoard(puzzle.map(r => [...r]));
    setBoard(puzzle.map(r => [...r]));

    localStorage.setItem("sudokuPuzzle", JSON.stringify(puzzle));
    localStorage.setItem("sudokuSolution", JSON.stringify(newSolution));
    localStorage.setItem("sudokuBoard", JSON.stringify(puzzle));
  } else {
    setPuzzleBoard(savedPuzzle);
    setSolutionBoard(savedSolution);
    setBoard(savedBoard);
  }

  setLoaded(true); // everything initialized
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
        if (!solutionBoard[r] || b[r][c] !== solutionBoard[r][c]) {
          setMessage("");
          return;
        }
      }
    }
    setMessage("🎉 Congratulations! Sudoku completed!");
    setTimerActive(false); // stop timer
  };

  const giveHint = () => {
     if (!solutionBoard || solutionBoard.length === 0) return;
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

if (!loaded) return <p>Loading Sudoku...</p>;

  return (
    <div>
      <h3>Sudoku Generator</h3>
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        <div>
          {/* Sudoku table */}
        </div>
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
          Time: {Math.floor(secondsElapsed / 60)}:{String(secondsElapsed % 60).padStart(2,'0')}
        </div>
      </div>
      <label>
        Difficulty:
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>
      <button onClick={() => generateSudoku(difficulty)} className="puzzle-button">Generate Sudoku</button>{" "}
      <button onClick={giveHint} className="puzzle-button">Give Hint</button>
      <p>{message}</p>
      <table style={{ borderCollapse: "collapse", marginTop: "10px" }}>
        <tbody>
          {board.map((row, rIdx) => (
  <tr key={rIdx}>
    {row.map((cell, cIdx) => {
      const isPrefilled = puzzleBoard[rIdx]?.[cIdx] !== 0;
      const isUserInput = !isPrefilled;
      const isCorrect = isUserInput && cell === solutionBoard[rIdx][cIdx];

      const color = isPrefilled
        ? "black"
        : cell === 0
        ? "black"
        : isCorrect
        ? "green"
        : "red";


      return (
        <td
          key={cIdx}
          style={{
            borderTop: rIdx % 3 === 0 ? "3px solid black" : "1px solid black",
            borderLeft: cIdx % 3 === 0 ? "3px solid black" : "1px solid black",
            borderBottom: rIdx === 8 ? "3px solid black" : "1px solid black",
            borderRight: cIdx === 8 ? "3px solid black" : "1px solid black",
            width: "40px",
            height: "40px",
            textAlign: "center",
          }}
        >
          <input
            type="text"
            maxLength="1"
            style={{
              width: "100%",
              height: "100%",
              fontSize: "20px",
              textAlign: "center",
              color,
              border: "none",
              padding: 0,
              margin: 0,
              boxSizing: "border-box",
            }}
            value={cell === 0 ? "" : cell}
            disabled={isPrefilled}
            onChange={(e) => handleInputChange(rIdx, cIdx, e.target.value)}
          />
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
