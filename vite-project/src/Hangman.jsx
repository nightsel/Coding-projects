// src/Hangman.jsx
import React, { useState, useEffect } from "react";

function Hangman() {
  const [wordList, setWordList] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [hint, setHint] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const maxWrong = 6;
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Load words.json
    fetch(`${import.meta.env.BASE_URL}datafiles/words.json`)
      .then((res) => res.json())
      .then((data) => setWordList(data))
      .catch((err) => console.error("Failed to load words.json:", err));
  }, []);

  useEffect(() => {
    if (wordList.length > 0) startGame();
  }, [wordList]);

  const startGame = () => {
    const wordObj = wordList[Math.floor(Math.random() * wordList.length)];
    setCurrentWord(wordObj.word.toUpperCase());
    setHint(wordObj.definition);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setMessage("");
  };

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter)) return;

    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);

    if (currentWord.includes(letter)) {
      // Check win
      const won = currentWord.split("").every((c) => newGuessed.includes(c));
      if (won) setMessage(`🎉 You won! The word was: ${currentWord}`);
    } else {
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);
      if (newWrong >= maxWrong) setMessage(`💀 You lost! The word was: ${currentWord}`);
    }
  };

  const renderWord = () => {
    return currentWord
      .split("")
      .map((c) => (guessedLetters.includes(c) ? c : "_"))
      .join(" ");
  };

  const renderLetters = () => {
    const letters = [];
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      letters.push(
        <button
          key={letter}
          onClick={() => handleGuess(letter)}
          disabled={guessedLetters.includes(letter) || message !== ""}
        >
          {letter}
        </button>
      );
    }
    return letters;
  };

  return (
    <div className="hangman">
      <h3>Hangman</h3>
      <p>Hint: {hint}</p>
      <p id="wordDisplay">{renderWord()}</p>
      <div id="letters">{renderLetters()}</div>
      <p>{message}</p>
      <button onClick={startGame}>Restart Game</button>
      <p>
        Wrong guesses: {wrongGuesses} / {maxWrong}
      </p>
    </div>
  );
}

export default Hangman;
