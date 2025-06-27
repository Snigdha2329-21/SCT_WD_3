let questions = [
  {
    type: "mcq",
    question: "What is the capital of Australia?",
    answers: [
      { text: "Sydney", correct: false },
      { text: "Melbourne", correct: false },
      { text: "Canberra", correct: true },
      { text: "Brisbane", correct: false }
    ]
  },
  {
    type: "mcq",
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Earth", correct: false },
      { text: "Mars", correct: true },
      { text: "Venus", correct: false },
      { text: "Jupiter", correct: false }
    ]
  },
  {
    type: "fill",
    question: "Water boils at what temperature (in Celsius)?",
    answer: "100"
  },
  {
    type: "fill",
    question: "How many continents are there on Earth?",
    answer: "7"
  },
  {
    type: "mcq",
    question: "Which language is used for web development?",
    answers: [
      { text: "Python", correct: false },
      { text: "Java", correct: false },
      { text: "HTML", correct: true },
      { text: "C++", correct: false }
    ]
  }
];

let currentQuestionIndex = 0;
let score = 0;

function addQuestion() {
  const type = document.querySelector("input[name='question-type']:checked").value;
  const questionText = document.getElementById("new-question").value;
  if (!questionText) return alert("Please enter a question.");

  if (type === "mcq") {
    const answerInputs = document.querySelectorAll(".answer");
    const correctIndex = document.querySelector("input[name='correct']:checked")?.value;
    if (!correctIndex || [...answerInputs].some(input => !input.value)) return alert("Fill all answers and select correct one.");
    const newQuestion = {
      type: "mcq",
      question: questionText,
      answers: [...answerInputs].map((input, index) => ({
        text: input.value,
        correct: parseInt(correctIndex) === index
      }))
    };
    questions.push(newQuestion);

  } else if (type === "fill") {
    const answerText = document.getElementById("fill-answer").value;
    if (!answerText) return alert("Please provide an answer.");
    questions.push({
      type: "fill",
      question: questionText,
      answer: answerText.trim().toLowerCase()
    });

  } else if (type === "multi") {
    const answerInputs = document.querySelectorAll(".multi-answer");
    const correctInputs = document.querySelectorAll(".multi-correct:checked");
    if ([...answerInputs].some(input => !input.value)) return alert("Fill all options.");
    if (correctInputs.length === 0) return alert("Select at least one correct answer.");
    const newQuestion = {
      type: "multi",
      question: questionText,
      answers: [...answerInputs].map((input, index) => ({
        text: input.value,
        correct: [...correctInputs].some(ci => parseInt(ci.value) === index)
      }))
    };
    questions.push(newQuestion);
  }

  alert("Question added!");
  document.getElementById("new-question").value = "";
  document.querySelectorAll(".answer, .multi-answer").forEach(input => input.value = "");
  document.getElementById("fill-answer").value = "";
  document.querySelectorAll(".multi-correct").forEach(input => input.checked = false);
}

function startQuiz() {
  if (questions.length === 0) {
    alert("Add at least one question first.");
    return;
  }
  currentQuestionIndex = 0;
  score = 0;
  document.getElementById("question-form").style.display = "none";
  document.getElementById("quiz").style.display = "block";
  showQuestion();
}

function showQuestion() {
  const q = questions[currentQuestionIndex];
  document.getElementById("question-number").innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  document.getElementById("question-text").innerText = q.question;
  const container = document.getElementById("answer-buttons");
  container.innerHTML = "";

  if (q.type === "mcq" || q.type === "multi") {
    q.answers.forEach((ans, index) => {
      const button = document.createElement("button");
      button.innerText = ans.text;
      button.onclick = () => selectAnswer(button, ans.correct, q.type === "multi");
      container.appendChild(button);
    });
  } else if (q.type === "fill") {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Your answer";
    input.id = "fill-input";
    container.appendChild(input);

    const submit = document.createElement("button");
    submit.innerText = "Submit";
    submit.onclick = () => {
      const userInput = document.getElementById("fill-input").value.trim().toLowerCase();
      if (userInput === q.answer) score++;
      document.getElementById("next-btn").style.display = "block";
      document.getElementById("skip-btn").style.display = "none";
    };
    container.appendChild(submit);
  }

  document.getElementById("next-btn").style.display = "none";
  document.getElementById("prev-btn").style.display = currentQuestionIndex > 0 ? "inline-block" : "none";
  document.getElementById("skip-btn").style.display = "inline-block";
}

function selectAnswer(button, isCorrect, isMulti) {
  const buttons = document.querySelectorAll("#answer-buttons button");
  buttons.forEach(btn => btn.disabled = true);
  if (isCorrect) {
    button.classList.add("correct");
    score++;
  } else {
    button.classList.add("wrong");
  }
  document.getElementById("next-btn").style.display = "block";
  document.getElementById("skip-btn").style.display = "none";
}

function skipQuestion() {
  document.getElementById("skip-btn").style.display = "none";
  document.getElementById("next-btn").style.display = "block";
}

function nextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    const newDoc = window.open("", "_blank");
    newDoc.document.write(`
      <html><head><title>Thank You</title></head>
      <body style="font-family: sans-serif; text-align: center; padding-top: 100px;">
        <h1>Thank you for your response!</h1>
        <p>Your score is ${score} out of ${questions.length}.</p>
      </body></html>`);
    newDoc.document.close();
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  }
}

// Show/hide input fields based on selected type
document.querySelectorAll("input[name='question-type']").forEach(radio => {
  radio.addEventListener("change", () => {
    document.getElementById("mcq-inputs").style.display = "none";
    document.getElementById("multi-inputs").style.display = "none";
    document.getElementById("fill-input").style.display = "none";

    if (radio.value === "mcq") {
      document.getElementById("mcq-inputs").style.display = "block";
    } else if (radio.value === "multi") {
      document.getElementById("multi-inputs").style.display = "block";
    } else if (radio.value === "fill") {
      document.getElementById("fill-input").style.display = "block";
    }
  });
});
