import { GoogleGenerativeAI } from "@google/generative-ai";

const ques = document.getElementById('ques');
const ans = document.getElementById('ans');
const submit = document.getElementById('submit');
const responseText = document.getElementById('responseText');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const ratingDiv = document.getElementById('rating');

const apiKey = 'AIzaSyAoZgZ4yzXGKHmXNaf4lb5_kNWiuBuOR1k';

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const quesArr = [
    "What are functions in JavaScript?",
    "Explain the concept of closures in JavaScript.",
    "What is the difference between `let`, `var`, and `const` in JavaScript?",
    "What is an arrow function in JavaScript?",
    "Explain event bubbling and event capturing in JavaScript.",
    "What are JavaScript promises?",
    "What is the difference between synchronous and asynchronous JavaScript?",
    "How do you create an object in JavaScript?",
    "What is a callback function in JavaScript?",
    "Explain the concept of hoisting in JavaScript."
  ];

let userArr = new Array(quesArr.length).fill(0);
let userAnswers = [];  
let currInd = 0;
  
function updateRatingDisplay(correct, incorrect) {
    ratingDiv.textContent = `Correct: ${correct}  |  Incorrect: ${incorrect}`;
}

function displayQuestion() {
    ques.textContent = `Q${currInd + 1}- ${quesArr[currInd]}`;
    ans.value = userAnswers[currInd] || ""; 
    responseText.textContent = ""; 
    // Disable Prev button on the first question
    prev.disabled = currInd === 0;

    // Disable Next button and show result on the last question
    if (currInd === quesArr.length - 1) {
        next.textContent = "Show Result";
        next.disabled = false;
    } 
    else {
        next.textContent = "Next";
        next.disabled = false;
    }
  }
  
//First Queestion
displayQuestion(); 

function showRating()
{
    let correct = 0;
    let incorrect = 0;
    console.log(userArr);
    userArr.forEach(ans => {
        if(ans == 1)
            correct++;
        else if(ans == 0)
            incorrect++;
    });
    //alert(`Correct: ${correct} Incorrect: ${incorrect}`);
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
                    A: ${userAnswer}    answer in 2 lines only`;

    const result = await model.generateContent(prompt);
    //console.log(result.response.text());
    responseText.textContent = result.response.text();

    const promptAns = `Q: ${ques.textContent} \n
                       A: ${userAnswer} if my answer if correct write  1 and if incorrect or empty write 0`;

    const resultAns = await model.generateContent(promptAns);    
    userArr[currInd] = (resultAns.response.text());
}


//Submit Handler
submit.addEventListener('click', submitAnswer);

//Next Handler
next.addEventListener('click',()=>{
    if (currInd < quesArr.length - 1) {
        currInd++;
        displayQuestion();
    } 
    else if (currInd === quesArr.length - 1) {
        //next.disabled = true;
        showRating();
    }
})

//Previous Handler
prev.addEventListener('click',()=>{
    if(currInd > 0)
    {
        currInd--;
        displayQuestion();
    }
})