import { useRef, useEffect } from "react";
import SlidingPuzzle from "./SlidingPuzzle";
import SudokuGenerator from "./SudokuGenerator";
import Hangman from "./Hangman";

export default function Puzzles({ section, forceHighlight }) {
  const slidingRef = useRef(null);
  const sudokuRef = useRef(null);
  const hangmanRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "end" });

    // Optional highlight effect
    ref.current.classList.add("highlight");
    setTimeout(() => ref.current.classList.remove("highlight"), 1000);
  };

  useEffect(() => {
    if (!section) return;

    if (section === "sliding") scrollTo(slidingRef);
    if (section === "sudoku") scrollTo(sudokuRef);
    if (section === "hangman") scrollTo(hangmanRef);
  }, [section, forceHighlight]);


  return (
    <div className="tabcontent puzzles">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="game-section" ref={slidingRef}><SlidingPuzzle /></div>
        <div className="game-section" ref={sudokuRef}><SudokuGenerator /></div>
        <div className="game-section" ref={hangmanRef}><Hangman /></div>
      </div>
    </div>
  );
}
