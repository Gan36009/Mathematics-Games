const submitBtn = document.getElementById("submit-number");
const logList = document.getElementById("log-number");
const startGameBtn = document.getElementById("start-game");
const gameForm = document.getElementById("game-form");
const logContainer = document.querySelector('.log-container');
const newscoreGames = document.getElementById('newscore-game');
const levelTime = document.getElementById('level-time');
let globalGame = JSON.parse(localStorage.getItem("globalGame")) || 0;
let bestTimes = JSON.parse(localStorage.getItem("bestTimes")) || [0, 0, 0];
let generatedNumber = "";
let attempts = 0;
let currentLevel = 1;
let startTime, endTime;

displayBestTimes();
newscoreGames.textContent = `Кількість зіграних ігор: ${globalGame}`;

function resetGame() {
  switch (currentLevel) {
    case 1:
      generatedNumber = generateNumber(1, 10);
      break;
    case 2:
      generatedNumber = generateNumber(10, 100);
      break;
    case 3:
      generatedNumber = generateNumber(100, 1000);
      break;
  }
  attempts = 0;
  logList.innerHTML = "";
  startTime = new Date();
  startGameBtn.textContent = `Розпочати рівень ${currentLevel}`;
}

function generateNumber(start, end) {
  return Math.floor(Math.random() * (end - start) + start);
}

function isValidInput(input) {
  return !isNaN(input) && Number.isInteger(+input) && input.length === currentLevel;
}

function printNumber(prompt, value) {
  const newItem = document.createElement("li");
  newItem.textContent = prompt;
  logList.appendChild(newItem);
  value.value = "";
}

function restartGame() {
  currentLevel = 1;
  startGameBtn.textContent = "Розпочати гру";
}

function updateBestTime(level, time) {
  if (bestTimes[level - 1] === 0 || time < bestTimes[level - 1]) {
    bestTimes[level - 1] = time;
    localStorage.setItem("bestTimes", JSON.stringify(bestTimes));
  }
}

function displayBestTimes() {
  let bestTimesText = "Найкращі часи за кожен рівень:<br>";
  for (let i = 0; i < bestTimes.length; i++) {
    const time = bestTimes[i] === 0 ? "-" : `${bestTimes[i]} сек`;
    bestTimesText += `Рівень ${i + 1}: ${time}<br>`;
  }
  levelTime.innerHTML = bestTimesText;
}

startGameBtn.addEventListener("click", function () {
  resetGame();
  displayBestTimes();
  newscoreGames.textContent = `Кількість зіграних ігор: ${globalGame}`;
  gameForm.style.display = "flex";
  startGameBtn.style.display = "none";
  logContainer.style.display = "flex";
});

submitBtn.addEventListener("click", function(event) {
  event.preventDefault();
  const input = document.getElementById("enter-number");
  const value = input.value.trim();

  if (!isValidInput(value)) {
    const alertMessage = "Будь ласка, введіть число правильної довжини!";
    printNumber(alertMessage, input);

    setTimeout(function() {
      const lastChild = logList.lastElementChild;
      if (lastChild.textContent === alertMessage) {
        logList.removeChild(lastChild);
      }
    }, 3000);

    return;
  }

  attempts++;
  if (+value === generatedNumber) {
    endTime = new Date();
    const timeDiff = Math.round((endTime - startTime) / 1000);
    updateBestTime(currentLevel, timeDiff);
    displayBestTimes();

    let prompt = `Ви вгадали! Спроба №${attempts}`;
    if (currentLevel < 3) {
      currentLevel++;
      prompt += ". Переходимо на наступний рівень!";
    } else {
      globalGame++;
      localStorage.setItem("globalGame", JSON.stringify(globalGame));
      newscoreGames.textContent = `Кількість зіграних ігор: ${globalGame}`;
      restartGame();
    }
    printNumber(prompt, input);
    setTimeout(function() {
      resetGame();
      startGameBtn.style.display = "block";
      gameForm.style.display = "none";
      logContainer.style.display = "none";
      logList.innerHTML = "";
    }, 5000);
  } else {
    let hint = (+value < generatedNumber) ? "Більше" : "Менше";
    let prompt = `Спроба №${attempts}: ${value} - ${hint}`;
    printNumber(prompt, input);
  }
});
