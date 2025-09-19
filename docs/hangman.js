let word = "";
let hint = "";
let guessed = [];
let wrongGuesses = 0;
const maxWrong = 6;


function renderWord() {
  const display = word.split("").map(letter =>
    guessed.includes(letter) ? letter : "_"
  ).join(" ");
  document.getElementById("wordDisplay").textContent = display;
}

function renderLetters() {
  const lettersDiv = document.getElementById("letters");
  lettersDiv.innerHTML = "";
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i).toLowerCase();
    const btn = document.createElement("button");
    btn.textContent = letter.toUpperCase();
    btn.disabled = guessed.includes(letter);
    btn.addEventListener("click", () => handleGuess(letter, btn));
    lettersDiv.appendChild(btn);
  }
}

function handleGuess(letter, btn) {
  guessed.push(letter);
  btn.disabled = true;

  if (word.includes(letter)) {
    renderWord();
    checkWin();
  } else {
    wrongGuesses++;
    checkLose();
  }
}

function checkWin() {
  if (word.split("").every(l => guessed.includes(l))) {
    document.getElementById("message").textContent = "🎉 You won! The word was: " + word;
    disableAllButtons();
  }
}

function checkLose() {
  if (wrongGuesses >= maxWrong) {
    document.getElementById("message").textContent = "💀 You lost! The word was: " + word;
    disableAllButtons();
  }
}

function disableAllButtons() {
  document.querySelectorAll("#letters button").forEach(btn => btn.disabled = true);
}


let wordList = [];

fetch('datafiles/words.json')
  .then(response => response.json())
  .then(data => {
    wordList = data;
    startGame(); // start Hangman after loading words
  })
  .catch(err => console.error('Failed to load words.json:', err));

  let currentWord = "";
  let guessedLetters = [];

  function startGame() {
      const wordObj = wordList[Math.floor(Math.random() * wordList.length)];
      currentWord = wordObj.word.toUpperCase();
      guessedLetters = [];

      const wordDisplay = document.getElementById("wordDisplay");
      const lettersDiv = document.getElementById("letters");
      const hintP = document.getElementById("hint");
      const messageP = document.getElementById("message");

      // Display underscores
      wordDisplay.textContent = "_ ".repeat(currentWord.length);

      // Show hint
      hintP.textContent = wordObj.definition;
      messageP.textContent = "";

      // Create A-Z buttons
      lettersDiv.innerHTML = "";
      for (let c = 65; c <= 90; c++) {
          const btn = document.createElement("button");
          btn.textContent = String.fromCharCode(c);
          btn.onclick = () => handleGuess(btn);
          lettersDiv.appendChild(btn);
      }
  }

  function handleGuess(button) {
      const letter = button.textContent;
      button.disabled = true;
      guessedLetters.push(letter);

      const wordDisplay = document.getElementById("wordDisplay");
      let display = "";
      let won = true;

      for (const c of currentWord) {
          if (guessedLetters.includes(c)) {
              display += c + " ";
          } else {
              display += "_ ";
              won = false;
          }
      }

      wordDisplay.textContent = display;

      if (won) {
          document.getElementById("message").textContent = "🎉 You won!";
          // Disable all remaining buttons
          document.querySelectorAll("#letters button").forEach(b => b.disabled = true);
      }
  }

// Start game on load
//window.addEventListener("DOMContentLoaded", startGame);
