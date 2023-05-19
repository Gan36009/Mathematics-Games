const submitBtn = document.getElementById("submit-number");
const logList = document.getElementById("log-number");
const startGameBtn = document.getElementById("start-game");
const gameForm = document.getElementById("game-form");
const logContainer = document.querySelector('.log-container');
const scoreGames = document.getElementById('score-game');
let globalGames = JSON.parse(localStorage.getItem("globalGames")) || 0;
let generatedNumber = "";
let attempts = 0;

scoreGames.textContent = `Кількість зіграних ігор: ${globalGames}`;

function resetGame() {
  generatedNumber = generateNumber();
  attempts = 0;
  logList.innerHTML = "";
}

function generateNumber() {
  let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let shuffledNumbers = shuffleArray(numbers);
  return shuffledNumbers.slice(0, 4).join("");
}

function isValidInput(input) {
  let uniqueNumbers = [...new Set(input.split(""))];
  return uniqueNumbers.length === 4;
}

function printNumber(prompt, value) {
  const newItem = document.createElement("li");
  newItem.textContent = prompt;
  logList.appendChild(newItem);
  value.value = "";
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

startGameBtn.addEventListener("click", function () {
  resetGame();
 console.log(generatedNumber);
  gameForm.style.display = "flex";
  startGameBtn.style.display = "none";
  logContainer.style.display = "flex";
});

submitBtn.addEventListener("click", function(event) {
  event.preventDefault();
  const input = document.getElementById("enter-number");
  const value = input.value.trim();

  if (!isValidInput(value)) {
    const alertMessage = "Будь ласка, введіть 4 унікальні цифри!";
    printNumber(alertMessage, input);

    // Виклик setTimeout для видалення повідомлення з логів через 3 секунд
    setTimeout(function() {
      const lastChild = logList.lastElementChild;
      if (lastChild.textContent === alertMessage) {
        logList.removeChild(lastChild);
      }
    }, 3000);

    return;
  }

  // Решта коду залишається без зміни
  attempts++;
  let bulls = 0;
  let cows = 0;

  for (let i = 0; i < generatedNumber.length; i++) {
    if (generatedNumber[i] === value[i]) {
      bulls++;
    } else if (generatedNumber.includes(value[i])) {
      cows++;
    }
  }

  let prompt = `Спроба №${attempts}: ${value} - Биків: ${bulls}, Корів: ${cows}`;

  if (bulls === 4) {
    prompt = `Ви виграли з ${attempts} спроби!`;
    globalGames++;
    localStorage.setItem("globalGames", JSON.stringify(globalGames));
    scoreGames.textContent = `Кількість зіграних ігор: ${globalGames}`;
    setTimeout(function() {
      resetGame();
      startGameBtn.style.display = "block";
      gameForm.style.display = "none";
      logContainer.style.display = "none";
      logList.innerHTML = "";
    }, 5000);
  }

  printNumber(prompt, input);
});
