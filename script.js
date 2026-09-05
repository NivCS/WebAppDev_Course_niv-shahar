const steps = [

  {
    title: "מתחילים פשוט",
    instruction: "העבר את הנקניקייה לצד ימין של הדוכן.",
    items: 1,

    expected: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-start",
      flexWrap: "nowrap"
    }
  },

  {
    title: "לגובה הנכון",
    instruction: "העבר את הנקניקייה לתחתית הדוכן.",
    items: 1,

    expected: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "flex-end",
      flexWrap: "nowrap"
    }
  },

  {
    title: "פינה מושלמת",
    instruction: "מקם את הנקניקייה בפינה הימנית התחתונה.",
    items: 1,

    expected: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      flexWrap: "nowrap"
    }
  },

 {
  title: "הנקניקיות מסתדרות מחדש",
  instruction: "הפוך את כיוון הסידור לעמודה. הנקניקיות צריכות להסתדר אחת מתחת לשנייה, במרכז הדוכן.",
  items: 2,

  expected: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "nowrap"
  }
  },

  {
    title: "שתי נקניקיות",
    instruction: "סדר שתי נקניקיות אחת מעל השנייה, במרכז הדוכן.",
    items: 2,

    expected: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap"
    }
  },

  {
    title: "מרווח שווה",
    instruction: "יש שלוש נקניקיות. סדר אותן בשורה עם מרווח שווה ביניהן.",
    items: 3,

    expected: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "nowrap"
    }
  },

  {
    title: "הזמנה גדולה",
    instruction: "יש שלוש נקניקיות. סדר אותן בשתי שורות בעזרת flex-wrap.",
    items: 3,

    expected: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap"
    },

    narrowBoard: true
  },

  {
    title: "אתגר השף 🌭",
    instruction: "סדר שלוש נקניקיות בעמודות, במרכז, והשתמש ב-flex-wrap.",
    items: 3,

    expected: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap"
    },

    narrowBoard: true
  }

];


let currentStep = 0;

let currentAttempts = 0;
let totalAttempts = 0;

let completedSteps = new Set();

let isTransitioning = false;


const arena = document.getElementById("arena");

const flexContainer =
  document.getElementById("flex-container");

const targetContainer =
  document.getElementById("target-container");


const directionSelect =
  document.getElementById("flex-direction");

const justifySelect =
  document.getElementById("justify-content");

const alignSelect =
  document.getElementById("align-items");

const wrapSelect =
  document.getElementById("flex-wrap");


const checkButton =
  document.getElementById("check-button");

const resetButton =
  document.getElementById("reset-button");


const prevButton =
  document.getElementById("prev-button");

const nextButton =
  document.getElementById("next-button");


const feedback =
  document.getElementById("feedback");

const attemptsElement =
  document.getElementById("attempts");


const stepNumber =
  document.getElementById("step-number");

const totalSteps =
  document.getElementById("total-steps");

const progressFill =
  document.getElementById("progress-fill");


const stepTitle =
  document.getElementById("step-title");

const stepInstruction =
  document.getElementById("step-instruction");


const stepDots =
  document.getElementById("step-dots");


const successOverlay =
  document.getElementById("success-overlay");

const successTitle =
  document.getElementById("success-title");

const successMessage =
  document.getElementById("success-message");

const finalAttempts =
  document.getElementById("final-attempts");

const restartButton =
  document.getElementById("restart-button");


totalSteps.textContent = steps.length;


/* Create food item */

function createFoodItem(type, isTarget) {

  const item = document.createElement("div");

  if (isTarget) {
    item.classList.add("target-bun");
  } else {
    item.classList.add("hotdog-item");
  }

  const image = document.createElement("img");

  if (type === "hotdog") {
    image.src = "images/hotdog.png";
    image.alt = "נקניקייה";
  } else {
    image.src = "images/bread.png";
    image.alt = "לחמנייה";
  }

  item.appendChild(image);

  return item;
}


/* Build stage */

function buildStageItems() {

  flexContainer.innerHTML = "";
  targetContainer.innerHTML = "";

  const count = steps[currentStep].items;

  for (let i = 0; i < count; i++) {

    const playerItem =
      createFoodItem("hotdog", false);

    const targetItem =
      createFoodItem("bread", true);

    flexContainer.appendChild(playerItem);
    targetContainer.appendChild(targetItem);
  }
}


/* Configure the logical board */

function configureBoard() {

  const step = steps[currentStep];

  if (step.narrowBoard) {

    flexContainer.style.width = "240px";
    targetContainer.style.width = "240px";

    flexContainer.style.left = "50%";
    targetContainer.style.left = "50%";

    flexContainer.style.right = "auto";
    targetContainer.style.right = "auto";

    flexContainer.style.transform =
      "translateX(-50%)";

    targetContainer.style.transform =
      "translateX(-50%)";

  } else {

    flexContainer.style.width = "";
    targetContainer.style.width = "";

    flexContainer.style.left = "";
    targetContainer.style.left = "";

    flexContainer.style.right = "";
    targetContainer.style.right = "";

    flexContainer.style.transform = "";
    targetContainer.style.transform = "";
  }
}


/* Apply Flexbox properties */

function applyFlexProperties(element, values) {

  element.style.flexDirection =
    values.flexDirection;

  element.style.justifyContent =
    values.justifyContent;

  element.style.alignItems =
    values.alignItems;

  element.style.flexWrap =
    values.flexWrap;
}


/* Get selected values */

function getSelectedValues() {

  return {
    flexDirection:
      directionSelect.value,

    justifyContent:
      justifySelect.value,

    alignItems:
      alignSelect.value,

    flexWrap:
      wrapSelect.value
  };
}


/* Apply target */

function applyTargetCSS() {

  applyFlexProperties(
    targetContainer,
    steps[currentStep].expected
  );
}


/* Apply player */

function applyPlayerCSS() {

  applyFlexProperties(
    flexContainer,
    getSelectedValues()
  );
}


/* Reset controls */

function resetControls() {

  directionSelect.value = "row";

  justifySelect.value = "flex-start";

  alignSelect.value = "flex-start";

  wrapSelect.value = "nowrap";

  applyPlayerCSS();
}


/* Update attempts */

function updateAttempts() {

  attemptsElement.textContent =
    currentAttempts;
}


/* Update progress */

function updateProgress() {

  const progress =
    ((currentStep + 1) / steps.length) * 100;

  progressFill.style.width =
    `${progress}%`;
}


/* Update stage information */

function updateStepInformation() {

  const step = steps[currentStep];

  stepNumber.textContent =
    currentStep + 1;

  stepTitle.textContent =
    step.title;

  stepInstruction.textContent =
    step.instruction;
}


/* Update navigation */

function updateNavigation() {

  prevButton.disabled =
    currentStep === 0;

  nextButton.disabled =
    currentStep === steps.length - 1;
}


/* Create dots */

function createDots() {

  stepDots.innerHTML = "";

  steps.forEach((step, index) => {

    const dot =
      document.createElement("div");

    dot.classList.add("dot");

    if (completedSteps.has(index)) {
      dot.classList.add("completed");
    }

    if (index === currentStep) {
      dot.classList.add("current");
    }

    stepDots.appendChild(dot);
  });
}


/* Load stage */

function loadStep() {

  isTransitioning = false;

  currentAttempts = 0;

  feedback.textContent = "";

  feedback.className =
    "feedback";

  arena.classList.remove(
    "correct",
    "wrong"
  );

  buildStageItems();

  configureBoard();

  applyTargetCSS();

  resetControls();

  updateStepInformation();

  updateAttempts();

  updateProgress();

  updateNavigation();

  createDots();
}


/* Check all four Flexbox values */

function propertiesMatch() {

  const selected =
    getSelectedValues();

  const expected =
    steps[currentStep].expected;

  return (
    selected.flexDirection ===
      expected.flexDirection &&

    selected.justifyContent ===
      expected.justifyContent &&

    selected.alignItems ===
      expected.alignItems &&

    selected.flexWrap ===
      expected.flexWrap
  );
}


/* Check item positions */

function positionsMatch() {

  const playerItems =
    flexContainer.querySelectorAll(
      ".hotdog-item"
    );

  const targetItems =
    targetContainer.querySelectorAll(
      ".target-bun"
    );

  if (
    playerItems.length !==
    targetItems.length
  ) {
    return false;
  }

  const tolerance = 8;

  for (
    let i = 0;
    i < playerItems.length;
    i++
  ) {

    const playerRect =
      playerItems[i].getBoundingClientRect();

    const targetRect =
      targetItems[i].getBoundingClientRect();

    const playerCenterX =
      playerRect.left +
      playerRect.width / 2;

    const playerCenterY =
      playerRect.top +
      playerRect.height / 2;

    const targetCenterX =
      targetRect.left +
      targetRect.width / 2;

    const targetCenterY =
      targetRect.top +
      targetRect.height / 2;

    const distanceX =
      Math.abs(
        playerCenterX -
        targetCenterX
      );

    const distanceY =
      Math.abs(
        playerCenterY -
        targetCenterY
      );

    if (
      distanceX > tolerance ||
      distanceY > tolerance
    ) {
      return false;
    }
  }

  return true;
}


/* Show success */

function showSuccessFeedback() {

  feedback.textContent =
    "✓ כל הכבוד! ההזמנה מוכנה!";

  feedback.className =
    "feedback success";

  arena.classList.remove("wrong");

  arena.classList.add("correct");
}


/* Show error */

function showErrorFeedback() {

  feedback.textContent =
    "✗ כמעט! בדוק את הגדרות ה-Flexbox ונסה שוב.";

  feedback.className =
    "feedback error";

  arena.classList.remove("correct");

  arena.classList.add("wrong");
}


/* Check solution */

function checkSolution() {

  if (isTransitioning) {
    return;
  }

  currentAttempts++;
  totalAttempts++;

  updateAttempts();

  applyPlayerCSS();

  requestAnimationFrame(() => {

    const correctProperties =
      propertiesMatch();

    const correctPositions =
      positionsMatch();

    if (
      !correctProperties ||
      !correctPositions
    ) {

      showErrorFeedback();

      return;
    }

    completedSteps.add(currentStep);

    showSuccessFeedback();

    createDots();

    isTransitioning = true;


    /* Final stage */

    if (
      currentStep ===
      steps.length - 1
    ) {

      setTimeout(() => {

        successTitle.textContent =
          "הדוכן מוכן! 🏆";

        successMessage.textContent =
          `סיימת בהצלחה את כל ${steps.length} השלבים!`;

        finalAttempts.textContent =
          totalAttempts;

        successOverlay.classList.remove(
          "hidden"
        );

        isTransitioning = false;

      }, 1200);

      return;
    }


    /* Move to next stage */

    setTimeout(() => {

      currentStep++;

      loadStep();

    }, 1200);

  });
}


/* Reset current stage */

function resetCurrentStep() {

  if (isTransitioning) {
    return;
  }

  currentAttempts = 0;

  updateAttempts();

  arena.classList.remove(
    "correct",
    "wrong"
  );

  feedback.textContent = "";

  feedback.className =
    "feedback";

  resetControls();

  applyTargetCSS();
}


/* Previous stage */

prevButton.addEventListener(
  "click",
  () => {

    if (
      isTransitioning ||
      currentStep === 0
    ) {
      return;
    }

    currentStep--;

    loadStep();
  }
);


/* Next stage */

nextButton.addEventListener(
  "click",
  () => {

    if (
      isTransitioning ||
      currentStep === steps.length - 1
    ) {
      return;
    }

    currentStep++;

    loadStep();
  }
);


/* Controls */

directionSelect.addEventListener(
  "change",
  applyPlayerCSS
);

justifySelect.addEventListener(
  "change",
  applyPlayerCSS
);

alignSelect.addEventListener(
  "change",
  applyPlayerCSS
);

wrapSelect.addEventListener(
  "change",
  applyPlayerCSS
);


/* Buttons */

checkButton.addEventListener(
  "click",
  checkSolution
);

resetButton.addEventListener(
  "click",
  resetCurrentStep
);


/* Restart */

restartButton.addEventListener(
  "click",
  () => {

    currentStep = 0;

    currentAttempts = 0;

    totalAttempts = 0;

    completedSteps.clear();

    successOverlay.classList.add(
      "hidden"
    );

    loadStep();
  }
);


/* Start */

loadStep();