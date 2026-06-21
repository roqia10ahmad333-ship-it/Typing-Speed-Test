const quotes = [
    "The only way to do great work is to love what you do.",
    "Innovation distinguishes between a leader and a follower.",
    "Life is what happens when you are busy making other plans.",
    "Your time is limited so don't waste it living someone else life.",
    "Stay hungry stay foolish.",
    "Simplicity is the ultimate sophistication.",
    "Dream big work hard stay focused."
];

const quoteDisplay = document.getElementById('quoteDisplay');
const quoteInput = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const resultMessage = document.getElementById('resultMessage');

let currentQuote = '';
let timeLeft = 30;
let isRunning = false;
let timerInterval = null;
let totalTyped = 0;
let correctTyped = 0;
let wrongTyped = 0;

function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

function displayQuote(quote) {
    quoteDisplay.innerHTML = '';
    for (let char of quote) {
        const span = document.createElement('span');
        span.textContent = char;
        quoteDisplay.appendChild(span);
    }
}

function resetTest() {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 30;
    totalTyped = 0;
    correctTyped = 0;
    wrongTyped = 0;
    timerElement.textContent = timeLeft;
    wpmElement.textContent = '0';
    accuracyElement.textContent = '100';
    resultMessage.textContent = '';
    quoteInput.value = '';
    quoteInput.disabled = true;
    currentQuote = getRandomQuote();
    displayQuote(currentQuote);
}

function updateStats() {
    const total = correctTyped + wrongTyped;
    const accuracy = total > 0 ? Math.round((correctTyped / total) * 100) : 100;
    accuracyElement.textContent = accuracy;
    const minutesElapsed = (30 - timeLeft) / 60;
    const wpm = minutesElapsed > 0 ? Math.round((correctTyped / 5) / minutesElapsed) : 0;
    wpmElement.textContent = wpm;
}

function handleTyping() {
    if (!isRunning) return;
    const typedText = quoteInput.value;
    const quoteChars = currentQuote.split('');
    const spans = quoteDisplay.querySelectorAll('span');
    correctTyped = 0;
    wrongTyped = 0;
    totalTyped = 0;
    spans.forEach((span, index) => {
        span.classList.remove('correct', 'incorrect', 'current');
        if (index < typedText.length) {
            totalTyped++;
            if (typedText[index] === quoteChars[index]) {
                span.classList.add('correct');
                correctTyped++;
            } else {
                span.classList.add('incorrect');
                wrongTyped++;
            }
        } else if (index === typedText.length) {
            span.classList.add('current');
        }
    });
    updateStats();
    if (typedText.length === quoteChars.length) {
        clearInterval(timerInterval);
        isRunning = false;
        quoteInput.disabled = true;
        resultMessage.textContent = '✅ Excellent! You completed it! 🎉';
        resultMessage.style.color = '#4ade80';
        updateStats();
    }
}

function startTest() {
    if (isRunning) return;
    isRunning = true;
    quoteInput.disabled = false;
    quoteInput.value = '';
    quoteInput.focus();
    resultMessage.textContent = '';
    timeLeft = 30;
    correctTyped = 0;
    wrongTyped = 0;
    totalTyped = 0;
    timerElement.textContent = timeLeft;
    wpmElement.textContent = '0';
    accuracyElement.textContent = '100';
    const spans = quoteDisplay.querySelectorAll('span');
    spans.forEach((span, index) => {
        span.classList.remove('correct', 'incorrect', 'current');
if (index === 0) span.classList.add('current');
    });
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            isRunning = false;
            quoteInput.disabled = true;
            resultMessage.textContent = '⏰ Time is up! Try again.';
            resultMessage.style.color = '#f97316';
            updateStats();
        }
    }, 1000);
}

startBtn.addEventListener('click', startTest);
resetBtn.addEventListener('click', resetTest);
quoteInput.addEventListener('input', handleTyping);

resetTest();