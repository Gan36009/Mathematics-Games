let timer = document.getElementById('timer');
const startGameBtn = document.getElementById("start-game");
const gameForm = document.getElementById("game-form");
const logContainer = document.querySelector('.log-container');
const scoreGames = document.getElementById('new3score-game');
let globalGames = JSON.parse(localStorage.getItem("globalGames3")) || 0;
const submitBtn = document.getElementById("submit-number");
let attempts = 0;
let timerInterval;
scoreGames.textContent = `Кількість зіграних ігор: ${globalGames}`;
startGameBtn.addEventListener("click", function () {
  attempts = 0;
  gameForm.style.display = "flex";
  startGameBtn.style.display = "none";
  logContainer.style.display = "flex";
  timer.style.display = "flex";
});

function generateNumbers() {
  let firstNumber, secondNumber;
  let operators = ["+", "-"];
  let operator = operators[Math.floor(Math.random() * operators.length)];

  if (attempts <= 10) {
    firstNumber = Math.floor(Math.random() * 10);
    secondNumber = Math.floor(Math.random() * 10);
  } else if (attempts <= 20) {
    firstNumber = Math.floor(Math.random() * 90) + 10;
    secondNumber = Math.floor(Math.random() * 90) + 10;
  } else {
    firstNumber = Math.floor(Math.random() * 900) + 100;
    secondNumber = Math.floor(Math.random() * 900) + 100;
  }

  return `${firstNumber} ${operator} ${secondNumber}`;
}

let expression = generateNumbers();

function correctAnswer(expression) {
  let [firstNumber, operator, secondNumber] = expression.split(" ");

  let result;
  if (operator === "+") {
    result = parseInt(firstNumber) + parseInt(secondNumber);
  } else if (operator === "-") {
    result = parseInt(firstNumber) - parseInt(secondNumber);
  }
  return result;
}

function displayExpression() {
  expression = generateNumbers();
  document.getElementById("expression").textContent = expression;
}

function startTimer() {
  let timeLeft = 8;
  timer.textContent = `Залишилося часу: ${timeLeft} секунд`;
  timerInterval = setInterval(function () {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timer.textContent = "Час вийшов";
      endGame();
    } else {
      timeLeft--;
      timer.textContent = `Залишилося часу: ${timeLeft} секунд`;
    }
  }, 1000);
}

function checkAnswer() {
  clearInterval(timerInterval);

  let userAnswer = document.getElementById("enter-number").value;
  let correctResult = correctAnswer(expression);

  if (parseInt(userAnswer) === correctResult) {
    console.log("Відповідь правильна!");
    attempts++;
    displayExpression();
    document.getElementById("enter-number").value = "";
    startTimer();
  } else {
    document.getElementById("expression").textContent = "Відповідь неправильна!";
    setTimeout(function () {
      endGame();
    }, 2000);
  }
}

function startGame() {
  attempts = 0;
  displayExpression();
  startTimer();
}

function endGame() {
  clearInterval(timerInterval);
  document.getElementById("expression").textContent = "";
  document.getElementById("log-number").innerHTML = "";
document.getElementById("enter-number").value = "";

  document.getElementById("expression").textContent = "Гра завершена!";

  globalGames++;
  localStorage.setItem("globalGames3", JSON.stringify(globalGames));
  scoreGames.textContent = `Кількість зіграних ігор: ${globalGames}`;
  setTimeout(function () {
    gameForm.style.display = "none";
    startGameBtn.style.display = "block";
    logContainer.style.display = "none";
    timer.style.display = "none";
  }, 3000);
}

document.getElementById("start-game").addEventListener("click", startGame);
document.getElementById("game-form").addEventListener("submit", function (event) {
  event.preventDefault();
  checkAnswer();
});
