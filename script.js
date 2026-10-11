const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-link");

function showPage(pageName) {
  pages.forEach(page => {
    page.classList.toggle("active", page.id === pageName);
  });

  navLinks.forEach(link => {
    link.classList.toggle("active", link.dataset.page === pageName);
  });

  if (pageName === "quiz" && !quizFinished) {
    renderQuestion();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    showPage(link.dataset.page);
  });
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => {
    showPage(button.dataset.go);
  });
});

const notes = [
  {
    subject: "C",
    title: "C Programming Basics",
    description: "C is a general-purpose programming language.",
    code: '#include <stdio.h>\n\nint main(void) {\n    printf("Hello World");\n    return 0;\n}'
  },
  {
    subject: "C",
    title: "Variables in C",
    description: "Variables store values using data types such as int, float and char.",
    code: 'int age = 20;\nfloat price = 12.5f;\nchar grade = \'A\';'
  },
  {
    subject: "HTML",
    title: "HTML Structure",
    description: "HTML defines the structure and content of a web page.",
    code: '<h1>Hello World</h1>\n<p>My first page</p>\n<button>Click Me</button>'
  },
  {
    subject: "HTML",
    title: "HTML Links",
    description: "The anchor tag creates a link to another page or website.",
    code: '<a href="https://example.com">Visit Website</a>'
  },
  {
    subject: "CSS",
    title: "CSS Basics",
    description: "CSS controls colors, spacing, fonts and layout.",
    code: 'body {\n  background: #101827;\n  color: white;\n}'
  },
  {
    subject: "CSS",
    title: "CSS Flexbox",
    description: "Flexbox helps arrange elements in a row or column.",
    code: '.container {\n  display: flex;\n  gap: 20px;\n  justify-content: center;\n}'
  },
  {
    subject: "JavaScript",
    title: "JavaScript Variables",
    description: "Use const for bindings that are not reassigned and let when reassignment is needed.",
    code: 'const name = "Meet";\nlet score = 0;\nscore = score + 1;'
  },
  {
    subject: "JavaScript",
    title: "JavaScript Events",
    description: "An event listener runs a function when an event occurs.",
    code: 'button.addEventListener("click", () => {\n  alert("Button clicked!");\n});'
  }
];

const notesList = document.getElementById("notesList");
const searchInput = document.getElementById("searchInput");
const noNotes = document.getElementById("noNotes");

function renderNotes(filter = "") {
  const query = filter.toLowerCase().trim();

  const filteredNotes = notes.filter(note => {
    const text = (
      note.subject + " " +
      note.title + " " +
      note.description
    ).toLowerCase();

    return text.includes(query);
  });

  notesList.replaceChildren();

  filteredNotes.forEach(note => {
    const article = document.createElement("article");
    article.className = "note-card";

    const heading = document.createElement("h2");
    heading.textContent = note.title;

    const subject = document.createElement("p");
    subject.textContent = "Subject: " + note.subject;

    const description = document.createElement("p");
    description.textContent = note.description;

    const code = document.createElement("pre");
    code.textContent = note.code;

    article.append(heading, subject, description, code);
    notesList.appendChild(article);
  });

  noNotes.classList.toggle("hidden", filteredNotes.length > 0);
}

searchInput.addEventListener("input", () => {
  renderNotes(searchInput.value);
});

document.querySelectorAll("[data-note]").forEach(button => {
  button.addEventListener("click", () => {
    searchInput.value = button.dataset.note;
    renderNotes(button.dataset.note);
    showPage("notes");
  });
});

renderNotes();

// QUIZ
const questions = [
  {
    question: "Which HTML tag creates a hyperlink?",
    options: ["<p>", "<a>", "<h1>", "<img>"],
    answer: 1
  },
  {
    question: "Which CSS property changes text color?",
    options: ["font-size", "background", "color", "margin"],
    answer: 2
  },
  {
    question: "Which keyword declares a block-scoped variable that can be reassigned?",
    options: ["let", "const", "static", "define"],
    answer: 0
  },
  {
    question: "Which C function displays formatted output?",
    options: ["scanf()", "printf()", "input()", "writeLine()"],
    answer: 1
  },
  {
    question: "Which HTML element is used to include JavaScript?",
    options: ["<css>", "<javascript>", "<script>", "<code>"],
    answer: 2
  }
];

let currentQuestion = 0;
let score = 0;
let answered = false;
let quizFinished = false;

const questionCount = document.getElementById("questionCount");
const scoreLabel = document.getElementById("scoreLabel");
const questionText = document.getElementById("questionText");
const optionsBox = document.getElementById("options");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const quizBox = document.getElementById("quizBox");
const quizResult = document.getElementById("quizResult");

function renderQuestion() {
  if (quizFinished) return;

  answered = false;

  const q = questions[currentQuestion];

  questionCount.textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  scoreLabel.textContent = `Score: ${score}`;
  questionText.textContent = q.question;
  feedback.textContent = "";
  optionsBox.replaceChildren();

  progressBar.style.width =
    `${(currentQuestion / questions.length) * 100}%`;

  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.textContent = option;

    button.addEventListener("click", () => {
      checkAnswer(index);
    });

    optionsBox.appendChild(button);
  });

  nextBtn.disabled = true;
  nextBtn.textContent =
    currentQuestion === questions.length - 1
      ? "See Result →"
      : "Next Question →";
}

function checkAnswer(selectedIndex) {
  if (answered || quizFinished) return;

  answered = true;

  const correctIndex = questions[currentQuestion].answer;
  const buttons = optionsBox.querySelectorAll(".option-btn");

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === correctIndex) {
      button.classList.add("correct");
    }

    if (index === selectedIndex && index !== correctIndex) {
      button.classList.add("wrong");
    }
  });

  if (selectedIndex === correctIndex) {
    score++;
    feedback.textContent = "Correct! Well done.";
  } else {
    feedback.textContent =
      "Not quite. Correct answer: " +
      questions[currentQuestion].options[correctIndex];
  }

  scoreLabel.textContent = `Score: ${score}`;
  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
  if (!answered || quizFinished) return;

  currentQuestion++;

  if (currentQuestion < questions.length) {
    renderQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  quizFinished = true;
  quizBox.classList.add("hidden");
  quizResult.classList.remove("hidden");
  progressBar.style.width = "100%";

  const heading = document.createElement("h2");
  heading.textContent = "Quiz Completed!";

  const resultText = document.createElement("p");
  resultText.textContent =
    `Your score: ${score} out of ${questions.length}`;

  const message = document.createElement("p");
  message.textContent =
    score === questions.length
      ? "Excellent! All answers are correct."
      : "Keep practising. You can improve your score!";

  const restartBtn = document.createElement("button");
  restartBtn.className = "primary-btn";
  restartBtn.textContent = "Try Again";

  restartBtn.addEventListener("click", restartQuiz);

  quizResult.replaceChildren(heading, resultText, message, restartBtn);
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  answered = false;
  quizFinished = false;

  quizResult.classList.add("hidden");
  quizBox.classList.remove("hidden");

  renderQuestion();
}

renderQuestion();