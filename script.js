const steps = [

  {
    title: "הנקניקייה מחכה!",
    instruction: "שים את הנקניקייה בצד ימין של הדוכן.",
    items: 1,

    expected: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-start",
      flexWrap: "nowrap"
    }
  },


  {
    title: "מגיעים למרכז",
    instruction: "מרכז את הנקניקייה אופקית באמצע הדוכן.",
    items: 1,

    expected: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "flex-start",
      flexWrap: "nowrap"
    }
  },


  {
    title: "פינה מושלמת",
    instruction: "שים את הנקניקייה בפינה הימנית התחתונה.",
    items: 1,

    expected: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      flexWrap: "nowrap"
    }
  },


  {
    title: "משנים כיוון!",
    instruction: "השתמש ב-flex-direction: column כדי להעביר את הנקניקייה לתחתית.",
    items: 1,

    expected: {
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "flex-start",
      flexWrap: "nowrap"
    }
  },


  {
    title: "למטה ובצד",
    instruction: "השתמש בכיוון עמודה כדי למקם את הנקניקייה בתחתית בצד ימין.",
    items: 1,

    expected: {
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      flexWrap: "nowrap"
    }
  },


  {
    title: "הזמנה זוגית",
    instruction: "יש שתי נקניקיות ושתי לחמניות. סדר אותן במרכז הדוכן, אחת ליד השנייה.",
    items: 2,

    expected: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap"
    }
  },


  {
    title: "הזמנה גדולה",
    instruction: "יש שלוש נקניקיות ושלוש לחמניות. סדר אותן בשתי שורות בעזרת flex-wrap.",
    items: 3,

    expected: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap"
    }
  },


  {
    title: "אתגר השף 🌭",
    instruction: "שלוש נקניקיות ושלוש לחמניות. השתמש ב-column וב-flex-wrap כדי לסדר את כולן.",
    items: 3,

    expected: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap"
    }
  }

];


let currentStep = 0;

let attempts = 0;

let completedSteps = new Set();

let isTransitioning = false;


const arena =
  document.getElementById("arena");

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


totalSteps.textContent =
  steps.length;


/* Create food item */

function createFoodItem(type, isTarget) {

  const item =
    document.createElement("div");


  if (isTarget) {

    item.classList.add("target-bun");

  } else {

    item.classList.add("hotdog-item");

  }


  const image =
    document.createElement("img");


  if (type === "hotdog") {

    image.src =
      "images/hotdog.png";

    image.alt =
      "נקניקייה";

  } else {

    image.src =
      "images/bread.png";

    image.alt =
      "לחמנייה";

  }


  item.appendChild(image);


  return item;
}


/* Build stage */

function buildStageItems() {

  flexContainer.innerHTML = "";

  targetContainer.innerHTML = "";


  const count =
    steps[currentStep].items;


  for (let i = 0; i < count; i++) {

    const playerItem =
      createFoodItem(
        "hotdog",
        false
      );


    const targetItem =
      createFoodItem(
        "bread",
        true
      );


    flexContainer.appendChild(
      playerItem
    );


    targetContainer.appendChild(
      targetItem
    );
  }
}


/* Apply Flexbox properties */

function applyFlexProperties(
  element,
  values
) {

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

  directionSelect.value =
    "row";

  justifySelect.value =
    "flex-start";

  alignSelect.value =
    "flex-start";

  wrapSelect.value =
    "nowrap";


  applyPlayerCSS();
}


/* Update attempts */

function updateAttempts() {

  attemptsElement.textContent =
    attempts;
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

  const step =
    steps[currentStep];


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


  steps.forEach(
    (step, index) => {

      const dot =
        document.createElement("div");


      dot.classList.add("dot");


      if (
        completedSteps.has(index)
      ) {

        dot.classList.add(
          "completed"
        );
      }


      if (
        index === currentStep
      ) {

        dot.classList.add(
          "current"
        );
      }


      stepDots.appendChild(dot);

    }
  );
}


/* Load stage */

function loadStep() {

  isTransitioning = false;


  feedback.textContent = "";

  feedback.className =
    "feedback";


  arena.classList.remove(
    "correct",
    "wrong"
  );


  buildStageItems();

  applyTargetCSS();

  resetControls();

  updateStepInformation();

  updateAttempts();

  updateProgress();

  updateNavigation();

  createDots();
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
      playerItems[i]
        .getBoundingClientRect();


    const targetRect =
      targetItems[i]
        .getBoundingClientRect();


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


  arena.classList.remove(
    "wrong"
  );

  arena.classList.add(
    "correct"
  );
}


/* Show error */

function showErrorFeedback() {

  feedback.textContent =
    "✗ כמעט! נסה לשנות את הגדרות ה-Flexbox.";

  feedback.className =
    "feedback error";


  arena.classList.remove(
    "correct"
  );

  arena.classList.add(
    "wrong"
  );
}


/* Check solution */

function checkSolution() {

  if (isTransitioning) {
    return;
  }


  attempts++;

  updateAttempts();


  applyPlayerCSS();


  requestAnimationFrame(() => {

    if (!positionsMatch()) {

      showErrorFeedback();

      return;
    }


    completedSteps.add(
      currentStep
    );


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
          attempts;


        successOverlay.classList.remove(
          "hidden"
        );


        isTransitioning = false;

      }, 1200);


      return;
    }


    /* Regular stage */

    setTimeout(() => {

      currentStep++;

      loadStep();

    }, 1200);

  });
}


/* Reset */

function resetCurrentStep() {

  if (isTransitioning) {
    return;
  }


  attempts = 0;

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


/* Previous */

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


/* Next */

nextButton.addEventListener(
  "click",
  () => {

    if (
      isTransitioning ||
      currentStep ===
      steps.length - 1
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

    attempts = 0;

    completedSteps.clear();


    successOverlay.classList.add(
      "hidden"
    );


    loadStep();

  }
);


/* Start */

loadStep();