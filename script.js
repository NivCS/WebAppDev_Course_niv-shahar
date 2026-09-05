const selectIds = [
  "sel-flex-direction",
  "sel-justify-content",
  "sel-align-items",
  "sel-flex-wrap"
];

const defaultSelections = {
  "sel-flex-direction": "row",
  "sel-justify-content": "flex-start",
  "sel-align-items": "flex-start",
  "sel-flex-wrap": "nowrap"
};


/* Game steps */

const steps = [

  {
    title: "הזמנה מספר 1",

    goal: "שים את הנקניקייה בצד ימין של הדוכן.",

    expected: {
      "sel-flex-direction": "row",
      "sel-justify-content": "flex-end",
      "sel-align-items": "flex-start",
      "sel-flex-wrap": "nowrap"
    }
  },


  {
    title: "הזמנה מספר 2",

    goal: "מרכז את הנקניקייה אופקית באמצע הדוכן.",

    expected: {
      "sel-flex-direction": "row",
      "sel-justify-content": "center",
      "sel-align-items": "flex-start",
      "sel-flex-wrap": "nowrap"
    }
  },


  {
    title: "הזמנה מספר 3",

    goal: "שים את הנקניקייה במרכז התחתון של הדוכן.",

    expected: {
      "sel-flex-direction": "row",
      "sel-justify-content": "center",
      "sel-align-items": "flex-end",
      "sel-flex-wrap": "nowrap"
    }
  },


  {
    title: "הזמנה מספר 4",

    goal: "שים את הנקניקייה בפינה הימנית התחתונה.",

    expected: {
      "sel-flex-direction": "row",
      "sel-justify-content": "flex-end",
      "sel-align-items": "flex-end",
      "sel-flex-wrap": "nowrap"
    }
  },


  {
    title: "הזמנה מספר 5",

    goal: "מרכז את הנקניקייה בדיוק באמצע הדוכן.",

    expected: {
      "sel-flex-direction": "row",
      "sel-justify-content": "center",
      "sel-align-items": "center",
      "sel-flex-wrap": "nowrap"
    }
  },


  {
    title: "הזמנה מספר 6",

    goal: "הפוך את כיוון הדוכן לעמודה והצב את הנקניקייה בתחתית.",

    expected: {
      "sel-flex-direction": "column",
      "sel-justify-content": "flex-end",
      "sel-align-items": "center",
      "sel-flex-wrap": "nowrap"
    }
  },


  {
    title: "הזמנה מספר 7",

    goal: "העבר את הנקניקייה לתחתית בצד ימין באמצעות שינוי כיוון הציר.",

    expected: {
      "sel-flex-direction": "column",
      "sel-justify-content": "flex-end",
      "sel-align-items": "flex-end",
      "sel-flex-wrap": "nowrap"
    }
  },


  {
    title: "הזמנה מספר 8",

    goal: "אתגר הסיום: מרכז את הנקניקייה באמצעות column-reverse.",

    expected: {
      "sel-flex-direction": "column-reverse",
      "sel-justify-content": "center",
      "sel-align-items": "center",
      "sel-flex-wrap": "nowrap"
    }
  }

];


let currentStep = 0;

const stepCompleted =
  Array(steps.length).fill(false);

const stepSelections =
  steps.map(() => ({
    ...defaultSelections
  }));

const stepAttempts =
  Array(steps.length).fill(0);


/* DOM elements */

const flexContainer =
  document.getElementById("flex-container");

const goalTitle =
  document.getElementById("goal-title");

const goalText =
  document.getElementById("goal-text");

const stepNum =
  document.getElementById("step-num");

const progressFill =
  document.getElementById("progress-fill");

const feedback =
  document.getElementById("feedback");

const attempts =
  document.getElementById("attempts");

const checkButton =
  document.getElementById("check-btn");

const resetButton =
  document.getElementById("reset-btn");

const nextButton =
  document.getElementById("next-btn");

const prevButton =
  document.getElementById("prev-btn");

const arena =
  document.getElementById("arena-wrapper");

const dots =
  document.getElementById("dots");

const successOverlay =
  document.getElementById("success-overlay");

const finalAttempts =
  document.getElementById("final-attempts");

const restartButton =
  document.getElementById("restart-btn");


/* Initialize */

function init() {

  renderDots();

  loadStep(0);

  selectIds.forEach(id => {

    document
      .getElementById(id)
      .addEventListener(
        "change",
        onSelectChange
      );

  });

  checkButton.addEventListener(
    "click",
    checkSolution
  );

  resetButton.addEventListener(
    "click",
    resetStep
  );

  nextButton.addEventListener(
    "click",
    nextStep
  );

  prevButton.addEventListener(
    "click",
    prevStep
  );

  restartButton.addEventListener(
    "click",
    restartGame
  );

}


/* Load step */

function loadStep(index) {

  currentStep = index;

  const step = steps[index];

  stepNum.textContent =
    index + 1;

  goalTitle.textContent =
    step.title;

  goalText.textContent =
    step.goal;


  selectIds.forEach(id => {

    document.getElementById(id).value =
      stepSelections[index][id];

  });


  applyPlayerCSS();

  clearFeedback();

  updateAttempts();

  updateButtons();

  updateProgress();

  updateDots();

}


/* Apply selected Flexbox properties */

function applyPlayerCSS() {

  flexContainer.style.flexDirection =
    document.getElementById(
      "sel-flex-direction"
    ).value;

  flexContainer.style.justifyContent =
    document.getElementById(
      "sel-justify-content"
    ).value;

  flexContainer.style.alignItems =
    document.getElementById(
      "sel-align-items"
    ).value;

  flexContainer.style.flexWrap =
    document.getElementById(
      "sel-flex-wrap"
    ).value;

}


/* Handle select changes */

function onSelectChange() {

  applyPlayerCSS();

  clearFeedback();

  arena.classList.remove("wrong");

}


/* Check solution */

function checkSolution() {

  if (stepCompleted[currentStep]) {

    nextStep();

    return;

  }


  stepAttempts[currentStep]++;

  updateAttempts();


  const expected =
    steps[currentStep].expected;


  let correct = true;


  selectIds.forEach(id => {

    const selected =
      document.getElementById(id).value;

    if (selected !== expected[id]) {

      correct = false;

    }

    stepSelections[currentStep][id] =
      selected;

  });


  applyPlayerCSS();


  if (!correct) {

    showError();

    return;

  }


  /*
   * The selected Flexbox values are correct.
   * We also check that the actual hotdog image
   * reached the bread target.
   */

  const hotdog =
    document.querySelector(".hotdog-item");

  const bread =
    document.querySelector(".target-bun");


  const hotdogRect =
    hotdog.getBoundingClientRect();

  const breadRect =
    bread.getBoundingClientRect();


  const hotdogCenterX =
    hotdogRect.left +
    hotdogRect.width / 2;

  const hotdogCenterY =
    hotdogRect.top +
    hotdogRect.height / 2;

  const breadCenterX =
    breadRect.left +
    breadRect.width / 2;

  const breadCenterY =
    breadRect.top +
    breadRect.height / 2;


  const distance =
    Math.sqrt(
      Math.pow(
        hotdogCenterX - breadCenterX,
        2
      ) +
      Math.pow(
        hotdogCenterY - breadCenterY,
        2
      )
    );


  if (distance < 18) {

    completeStep();

  } else {

    showError();

  }

}


/* Complete step */

function completeStep() {

  stepCompleted[currentStep] = true;

  feedback.textContent =
    "✅ מעולה! הנקניקייה על הלחמנייה!";

  feedback.className =
    "feedback success";


  arena.classList.remove("wrong");

  arena.classList.add("correct");


  updateButtons();

  updateDots();

  updateProgress();


  setTimeout(() => {

    arena.classList.remove("correct");

  }, 700);

}


/* Incorrect solution */

function showError() {

  feedback.textContent =
    "❌ לא נכון... שנה את ערכי ה־Flexbox ונסה שוב.";

  feedback.className =
    "feedback error";


  arena.classList.remove("correct");

  arena.classList.remove("wrong");


  void arena.offsetWidth;

  arena.classList.add("wrong");


  setTimeout(() => {

    arena.classList.remove("wrong");

  }, 400);

}


/* Reset current step */

function resetStep() {

  selectIds.forEach(id => {

    document.getElementById(id).value =
      defaultSelections[id];

    stepSelections[currentStep][id] =
      defaultSelections[id];

  });


  stepCompleted[currentStep] = false;

  applyPlayerCSS();

  clearFeedback();

  arena.classList.remove("correct");

  arena.classList.remove("wrong");

  updateButtons();

  updateProgress();

  updateDots();

}


/* Clear feedback */

function clearFeedback() {

  feedback.textContent = "";

  feedback.className =
    "feedback";

}


/* Attempts */

function updateAttempts() {

  attempts.textContent =
    stepAttempts[currentStep];

}


/* Buttons */

function updateButtons() {

  prevButton.disabled =
    currentStep === 0;

  nextButton.disabled =
    !stepCompleted[currentStep];


  if (stepCompleted[currentStep]) {

    if (
      currentStep ===
      steps.length - 1
    ) {

      checkButton.innerHTML =
        "<span>🏆</span> סיום המשחק";

    } else {

      checkButton.innerHTML =
        "<span>→</span> עבור לשלב הבא";

    }

  } else {

    checkButton.innerHTML =
      "<span>✓</span> בדוק את ההזמנה";

  }

}


/* Progress */

function updateProgress() {

  const completed =
    stepCompleted.filter(Boolean).length;

  const progress =
    (completed / steps.length) * 100;

  progressFill.style.width =
    `${progress}%`;

}


/* Next step */

function nextStep() {

  if (!stepCompleted[currentStep]) {

    return;

  }


  if (
    currentStep ===
    steps.length - 1
  ) {

    finishGame();

    return;

  }


  currentStep++;

  loadStep(currentStep);

}


/* Previous step */

function prevStep() {

  if (currentStep <= 0) {

    return;

  }


  currentStep--;

  loadStep(currentStep);

}


/* Progress dots */

function renderDots() {

  dots.innerHTML = "";


  steps.forEach((_, index) => {

    const dot =
      document.createElement("div");

    dot.className =
      "dot";

    dot.id =
      `dot-${index}`;


    dot.addEventListener(
      "click",
      () => {

        if (
          stepCompleted[index] ||
          index === currentStep
        ) {

          loadStep(index);

        }

      }
    );


    dots.appendChild(dot);

  });

}


/* Update dots */

function updateDots() {

  steps.forEach((_, index) => {

    const dot =
      document.getElementById(
        `dot-${index}`
      );

    dot.className =
      "dot";


    if (stepCompleted[index]) {

      dot.classList.add(
        "completed"
      );

    }


    if (index === currentStep) {

      dot.classList.add(
        "current"
      );

    }

  });

}


/* Finish */

function finishGame() {

  const totalAttempts =
    stepAttempts.reduce(
      (sum, value) =>
        sum + value,
      0
    );


  finalAttempts.textContent =
    totalAttempts;


  progressFill.style.width =
    "100%";


  successOverlay.classList.remove(
    "hidden"
  );

}


/* Restart */

function restartGame() {

  currentStep = 0;

  stepCompleted.fill(false);

  stepAttempts.fill(0);


  steps.forEach((_, index) => {

    stepSelections[index] = {
      ...defaultSelections
    };

  });


  successOverlay.classList.add(
    "hidden"
  );


  loadStep(0);

}


init();