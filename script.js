const selectIds = [
"sel-flex-direction",
"sel-justify-content",
"sel-align-items",
"sel-flex-wrap"
];

const cssProperties = [
"flex-direction",
"justify-content",
"align-items",
"flex-wrap"
];

const defaultSelections = {
"sel-flex-direction": "row",
"sel-justify-content": "flex-start",
"sel-align-items": "flex-start",
"sel-flex-wrap": "nowrap"
};

/*                                                                         |
| -------------------------------------------------------------------------- |
| STEPS                                                                      |
| -------------------------------------------------------------------------- |
| */                                                                         

const steps = [

{
title: "הזמנה מספר 1",
goal: "שים את הנקניקייה בצד ימין של הדוכן.",
expected: {
"sel-flex-direction": "row",
"sel-justify-content": "flex-end",
"sel-align-items": "flex-start",
"sel-flex-wrap": "nowrap"
},
extras: 0
},

{
title: "הזמנה מספר 2",
goal: "מרכז את הנקניקייה באמצע הדוכן.",
expected: {
"sel-flex-direction": "row",
"sel-justify-content": "center",
"sel-align-items": "flex-start",
"sel-flex-wrap": "nowrap"
},
extras: 0
},

{
title: "הזמנה מספר 3",
goal: "שים את הנקניקייה במרכז התחתון של הדוכן.",
expected: {
"sel-flex-direction": "row",
"sel-justify-content": "center",
"sel-align-items": "flex-end",
"sel-flex-wrap": "nowrap"
},
extras: 0
},

{
title: "הזמנה מספר 4",
goal: "שים את הנקניקייה בפינה הימנית התחתונה.",
expected: {
"sel-flex-direction": "row",
"sel-justify-content": "flex-end",
"sel-align-items": "flex-end",
"sel-flex-wrap": "nowrap"
},
extras: 0
},

{
title: "הזמנה מספר 5",
goal: "סדר את הנקניקייה במרכז הדוכן, גם אופקית וגם אנכית.",
expected: {
"sel-flex-direction": "row",
"sel-justify-content": "center",
"sel-align-items": "center",
"sel-flex-wrap": "nowrap"
},
extras: 0
},

{
title: "הזמנה מספר 6",
goal: "הפוך את הדוכן לעמודה, ומקם את הנקניקייה בתחתית כשהיא מיושרת לשמאל.",
expected: {
"sel-flex-direction": "column",
"sel-justify-content": "flex-end",
"sel-align-items": "flex-start",
"sel-flex-wrap": "nowrap"
},
extras: 0
},

{
title: "הזמנה מספר 7",
goal: "הכנת מגש עם כל התוספות: אפשר לפריטים לעבור לשורה חדשה ולמרכז את המגש.",
expected: {
"sel-flex-direction": "row",
"sel-justify-content": "center",
"sel-align-items": "center",
"sel-flex-wrap": "wrap"
},
extras: 5
},

{
title: "הזמנה מספר 8",
goal: "אתגר השף: הפוך את כיוון ההגשה, העבר את הפריטים לשורות, ומרכז את הכול בדוכן.",
expected: {
"sel-flex-direction": "row-reverse",
"sel-justify-content": "space-evenly",
"sel-align-items": "center",
"sel-flex-wrap": "wrap"
},
extras: 5
}

];

/*                                                                         |
| -------------------------------------------------------------------------- |
| GAME STATE                                                                 |
| -------------------------------------------------------------------------- |
| */                                                                         

let currentStep = 0;

const stepCompleted = Array(steps.length).fill(false);

const stepSelections = steps.map(() => ({
...defaultSelections
}));

const stepAttempts = Array(steps.length).fill(0);

/*                                                                         |
| -------------------------------------------------------------------------- |
| DOM                                                                        |
| -------------------------------------------------------------------------- |
| */                                                                         

const flexContainer = document.getElementById("flex-container");
const flexTarget = document.getElementById("flex-target");

const goalTitle = document.getElementById("goal-title");
const goalText = document.getElementById("goal-text");

const stepNum = document.getElementById("step-num");
const progressFill = document.getElementById("progress-fill");

const feedback = document.getElementById("feedback");
const attempts = document.getElementById("attempts");

const checkButton = document.getElementById("check-btn");
const resetButton = document.getElementById("reset-btn");

const nextButton = document.getElementById("next-btn");
const prevButton = document.getElementById("prev-btn");

const arena = document.getElementById("arena-wrapper");

const dots = document.getElementById("dots");

const successOverlay = document.getElementById("success-overlay");
const finalAttempts = document.getElementById("final-attempts");
const restartButton = document.getElementById("restart-btn");

/*                                                                         |
| -------------------------------------------------------------------------- |
| INITIALIZATION                                                             |
| -------------------------------------------------------------------------- |
| */                                                                         

function init() {

renderDots();

loadStep(0);

selectIds.forEach(id => {
document.getElementById(id).addEventListener("change", onSelectChange);
});

checkButton.addEventListener("click", checkSolution);

resetButton.addEventListener("click", resetStep);

nextButton.addEventListener("click", nextStep);

prevButton.addEventListener("click", prevStep);

restartButton.addEventListener("click", restartGame);
}

/*                                                                         |
| -------------------------------------------------------------------------- |
| LOAD STEP                                                                  |
| -------------------------------------------------------------------------- |
| */                                                                         

function loadStep(index) {

const step = steps[index];

currentStep = index;

goalTitle.textContent = step.title;
goalText.textContent = step.goal;

stepNum.textContent = index + 1;

/*

* Load previous selections
  */

selectIds.forEach(id => {


document.getElementById(id).value =
  stepSelections[index][id];


});

/*

* Configure number of items
  */

updateExtraItems(step.extras);

/*

* Apply player CSS
  */

applyPlayerCSS();

/*

* Apply target CSS
  */

applyTargetCSS();

/*

* Feedback
  */

clearFeedback();

/*

* Attempts
  */

updateAttempts();

/*

* Navigation
  */

prevButton.disabled = index === 0;

nextButton.disabled = !stepCompleted[index];

/*

* Progress
  */

const progress =
((index + 1) / steps.length) * 100;

progressFill.style.width = `${progress}%`;

/*

* Button state
  */

if (stepCompleted[index]) {


checkButton.innerHTML =
  "<span>→</span> עבור לשלב הבא";


} else {


checkButton.innerHTML =
  "<span>✓</span> בדוק את ההזמנה";


}

/*

* Dots
  */

updateDots();
}

/*                                                                         |
| -------------------------------------------------------------------------- |
| APPLY PLAYER CSS                                                           |
| -------------------------------------------------------------------------- |
| */                                                                         

function applyPlayerCSS() {

flexContainer.style.flexDirection =
document.getElementById("sel-flex-direction").value;

flexContainer.style.justifyContent =
document.getElementById("sel-justify-content").value;

flexContainer.style.alignItems =
document.getElementById("sel-align-items").value;

flexContainer.style.flexWrap =
document.getElementById("sel-flex-wrap").value;
}

/*                                                                         |
| -------------------------------------------------------------------------- |
| APPLY TARGET CSS                                                           |
| -------------------------------------------------------------------------- |
| */                                                                         

function applyTargetCSS() {

const expected = steps[currentStep].expected;

flexTarget.style.flexDirection =
expected["sel-flex-direction"];

flexTarget.style.justifyContent =
expected["sel-justify-content"];

flexTarget.style.alignItems =
expected["sel-align-items"];

flexTarget.style.flexWrap =
expected["sel-flex-wrap"];
}

/*                                                                         |
| -------------------------------------------------------------------------- |
| EXTRA ITEMS                                                                |
| -------------------------------------------------------------------------- |
| */                                                                         

function updateExtraItems(number) {

const extraItems =
document.querySelectorAll(".extra-item");

extraItems.forEach((item, index) => {


if (index < number) {

  item.classList.remove("hidden");

} else {

  item.classList.add("hidden");

}


});
}

/*                                                                         |
| -------------------------------------------------------------------------- |
| SELECT CHANGE                                                              |
| -------------------------------------------------------------------------- |
| */                                                                         

function onSelectChange() {

applyPlayerCSS();

arena.classList.remove("wrong");

clearFeedback();

}

/*                                                                         |
| -------------------------------------------------------------------------- |
| CHECK SOLUTION                                                             |
| -------------------------------------------------------------------------- |
| */                                                                         

function checkSolution() {

if (stepCompleted[currentStep]) {


nextStep();

return;


}

stepAttempts[currentStep]++;

updateAttempts();

/*

* Save current selections
  */

selectIds.forEach(id => {


stepSelections[currentStep][id] =
  document.getElementById(id).value;


});

applyPlayerCSS();

/*

* Compare actual layout against target.
*
* For one-item levels we compare the position
* of the hotdog to the target.
  */

const targetItems =
flexTarget.children;

const playerItems =
flexContainer.children;

if (steps[currentStep].extras === 0) {


const playerItem =
  playerItems[0];

const targetItem =
  targetItems[0];


const playerRect =
  playerItem.getBoundingClientRect();

const targetRect =
  targetItem.getBoundingClientRect();


const playerCenterX =
  playerRect.left + playerRect.width / 2;

const playerCenterY =
  playerRect.top + playerRect.height / 2;

const targetCenterX =
  targetRect.left + targetRect.width / 2;

const targetCenterY =
  targetRect.top + targetRect.height / 2;


const distance =
  Math.sqrt(
    Math.pow(playerCenterX - targetCenterX, 2) +
    Math.pow(playerCenterY - targetCenterY, 2)
  );


if (distance < 12) {

  completeStep();

} else {

  showError();

}


} else {


/*
* Multi-item levels are checked by CSS values.
*
* This is necessary because the target is a
* complete Flexbox arrangement rather than
* one single position.
*/

const expected =
  steps[currentStep].expected;

let correct = true;


selectIds.forEach(id => {

  const selected =
    document.getElementById(id).value;

  if (selected !== expected[id]) {

    correct = false;

  }

});


if (correct) {

  completeStep();

} else {

  showError();

}


}

}

/*                                                                         |
| -------------------------------------------------------------------------- |
| COMPLETE                                                                   |
| -------------------------------------------------------------------------- |
| */                                                                         

function completeStep() {

stepCompleted[currentStep] = true;

feedback.textContent =
"✅ מעולה! ההזמנה מוכנה להגשה!";

feedback.className =
"feedback success";

arena.classList.remove("wrong");

arena.classList.add("correct");

nextButton.disabled = false;

checkButton.innerHTML =
"<span>→</span> עבור לשלב הבא";

updateDots();

setTimeout(() => {


arena.classList.remove("correct");


}, 700);

/*

* If this is the last step,
* show completion button behavior.
  */

if (currentStep === steps.length - 1) {


checkButton.innerHTML =
  "<span>🏆</span> סיום המשחק";


}

}

/*                                                                         |
| -------------------------------------------------------------------------- |
| ERROR                                                                      |
| -------------------------------------------------------------------------- |
| */                                                                         

function showError() {

feedback.textContent =
"❌ כמעט! שנה את ערכי ה־Flexbox ונסה שוב.";

feedback.className =
"feedback error";

arena.classList.remove("correct");

arena.classList.remove("wrong");

/*

* Force animation restart
  */

void arena.offsetWidth;

arena.classList.add("wrong");

setTimeout(() => {


arena.classList.remove("wrong");


}, 400);

}

/*                                                                         |
| -------------------------------------------------------------------------- |
| RESET                                                                      |
| -------------------------------------------------------------------------- |
| */                                                                         

function resetStep() {

selectIds.forEach(id => {


document.getElementById(id).value =
  defaultSelections[id];

stepSelections[currentStep][id] =
  defaultSelections[id];


});

applyPlayerCSS();

clearFeedback();

arena.classList.remove("correct");
arena.classList.remove("wrong");

/*

* Reset does not erase completion.
* The user can return to the default
* solution state without losing progress.
  */

}

/*                                                                         |
| -------------------------------------------------------------------------- |
| FEEDBACK                                                                   |
| -------------------------------------------------------------------------- |
| */                                                                         

function clearFeedback() {

feedback.textContent = "";

feedback.className = "feedback";

}
 /*                                                                         |
| -------------------------------------------------------------------------- |
| ATTEMPTS                                                                   |
| -------------------------------------------------------------------------- |
| */                                                                         

function updateAttempts() {

attempts.textContent =
stepAttempts[currentStep];

}

/*                                                                         |
| -------------------------------------------------------------------------- |
| NAVIGATION                                                                 |
| -------------------------------------------------------------------------- |
| */                                                                         

function nextStep() {

if (!stepCompleted[currentStep]) {


return;


}

if (currentStep === steps.length - 1) {


finishGame();

return;


}

currentStep++;

loadStep(currentStep);

}

function prevStep() {

if (currentStep <= 0) {


return;


}

currentStep--;

loadStep(currentStep);

}

 /*                                                                         |
| -------------------------------------------------------------------------- |
| DOTS                                                                       |
| -------------------------------------------------------------------------- |
| */                                                                         

function renderDots() {

dots.innerHTML = "";

steps.forEach((_, index) => {


const dot =
  document.createElement("div");

dot.className = "dot";

dot.id = `dot-${index}`;


/*
* Allow returning to completed levels
*/

dot.addEventListener("click", () => {

  if (stepCompleted[index] || index === currentStep) {

    loadStep(index);

  }

});


dots.appendChild(dot);


});

}

function updateDots() {

steps.forEach((_, index) => {

const dot =
  document.getElementById(`dot-${index}`);

dot.className = "dot";


if (stepCompleted[index]) {

  dot.classList.add("completed");

}


if (index === currentStep) {

  dot.classList.add("current");

}


});

}

/*                                                                    
| -------------------------------------------------------------------------- |
| FINISH GAME                                                                |
| -------------------------------------------------------------------------- |
| */                                                                         |

function finishGame() {

const totalAttempts =
stepAttempts.reduce(
(sum, value) => sum + value,
0
);

finalAttempts.textContent =
totalAttempts;

successOverlay.classList.remove("hidden");

}

| /*                                                                         |
| -------------------------------------------------------------------------- |
| RESTART                                                                    |
| -------------------------------------------------------------------------- |
| */                                                                         |

function restartGame() {

currentStep = 0;

stepCompleted.fill(false);

stepAttempts.fill(0);

steps.forEach((_, index) => {


stepSelections[index] = {
  ...defaultSelections
};


});

successOverlay.classList.add("hidden");

loadStep(0);

}

/*                                                                         |
| -------------------------------------------------------------------------- |
| START                                                                      |
| -------------------------------------------------------------------------- |
| */                                                                         |

init();
