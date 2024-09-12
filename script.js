import { GoogleGenerativeAI } from "@google/generative-ai";

const ques = document.getElementById('ques');
const ans = document.getElementById('ans');
const submit = document.getElementById('submit');
const responseText = document.getElementById('responseText');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const ratingDiv = document.getElementById('rating');
const topicInput = document.getElementById('topicInput');
const startQuiz = document.getElementById('startQuiz');
const quizContent = document.getElementById('quizContent');


const apiKey = 'Your API Key Here';

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let userArr = new Array(10).fill(0);  // Track correctness for 10 questions
let userAnswers = [];
let generatedQuestions = [];
let currInd = 0;
let topic = '';

async function generateQuestion(index) {
    if (!generatedQuestions[index]) {
        const prompt = `Generate a random good single line question on ${topic}`;
        const result = await model.generateContent(prompt);
        generatedQuestions[index] = result.response.text();  // Store the generated question
    }
    return generatedQuestions[index];
}

function updateRatingDisplay(correct, incorrect) {
    ratingDiv.textContent = `Correct: ${correct}  |  Incorrect: ${incorrect}`;
}

async function displayQuestion() {
    const question = await generateQuestion(currInd);
    ques.textContent = `Q${currInd + 1}- ${question}`;
    ans.value = userAnswers[currInd] || ""; 
    responseText.textContent = "";

    prev.disabled = currInd === 0;
    next.textContent = currInd === userArr.length - 1 ? "Show Result" : "Next";
}

startQuiz.addEventListener('click', () => {
    topic = topicInput.value;
    if (!topic) {
        alert('Please enter a topic!');
        return;
    }
    topicInput.disabled = true;
    startQuiz.disabled = true;
    quizContent.hidden = false;
    displayQuestion();
    next.disabled = false;
});

function showRating() {
    let correct = 0;
    let incorrect = 0;
    userArr.forEach(ans => {
        if (ans === 1) correct++;
        else if (ans === 0) incorrect++;
    });
    updateRatingDisplay(correct, incorrect);
}

async function submitAnswer() {
    const userAnswer = ans.value;

    if (!userAnswer) {
        alert('Please type your answer!');
        return;
    }

    userAnswers[currInd] = userAnswer;
    const prompt = `Q: ${ques.textContent} \n
                    A: ${userAnswer} answer in 2 lines only`;

    const result = await model.generateContent(prompt);
    responseText.textContent = result.response.text();

    const promptAns = `Q: ${ques.textContent} \nA: ${userAnswer} if my answer is correct write 1; if incorrect or empty write 0`;

    const resultAns = await model.generateContent(promptAns);
    userArr[currInd] = parseInt(resultAns.response.text(), 10);
}

submit.addEventListener('click', submitAnswer);

next.addEventListener('click', () => {
    if (currInd < userArr.length - 1) {
        currInd++;
        displayQuestion();
    } else if (currInd === userArr.length - 1) {
        showRating();
    }
});

prev.addEventListener('click', () => {
    if (currInd > 0) {
        currInd--;
        displayQuestion();
    }
});
