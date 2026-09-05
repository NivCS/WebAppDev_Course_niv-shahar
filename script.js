const stepBg = [
  { page: '#1a1a2e', arena: '#0f1e3d' },
  { page: '#1a2e1a', arena: '#0f3d1a' },
  { page: '#2e1a2e', arena: '#3d0f3d' },
  { page: '#2e2a1a', arena: '#3d340f' },
  { page: '#1a2a2e', arena: '#0f2e3d' },
  { page: '#2e1a1a', arena: '#3d0f0f' }
];

const steps = [
  {
    goal: "הזז את הנקניקייה לצד הימני של המיכל.",
    expected: {
      'sel-flex-direction':  'row',
      'sel-justify-content': 'flex-end',
      'sel-align-items':     'flex-start',
      'sel-flex-wrap':       'nowrap'
    }
  },
  {
    goal: "מרכז את הנקניקייה אופקית.",
    expected: {
      'sel-flex-direction':  'row',
      'sel-justify-content': 'center',
      'sel-align-items':     'flex-start',
      'sel-flex-wrap':       'nowrap'
    }
  },
  {
    goal: "הזז את הנקניקייה לתחתית המיכל.",
    expected: {
      'sel-flex-direction':  'row',
      'sel-justify-content': 'flex-start',
      'sel-align-items':     'flex-end',
      'sel-flex-wrap':       'nowrap'
    }
  },
  {
    goal: "הזז את הנקניקייה לפינה הימנית התחתונה.",
    expected: {
      'sel-flex-direction':  'row',
      'sel-justify-content': 'flex-end',
      'sel-align-items':     'flex-end',
      'sel-flex-wrap':       'nowrap'
    }
  },
  {
    goal: "מרכז את הנקניקייה בדיוק באמצע המיכל.",
    expected: {
      'sel-flex-direction':  'row',
      'sel-justify-content': 'center',
      'sel-align-items':     'center',
      'sel-flex-wrap':       'nowrap'
    }
  },
  {
    goal: "הזז את הנקניקייה לתחתית המיכל בכיוון עמודה.",
    expected: {
      'sel-flex-direction':  'column',
      'sel-justify-content': 'flex-end',
      'sel-align-items':     'flex-start',
      'sel-flex-wrap':       'nowrap'
    }
  }
];

const selectIds    = ['sel-flex-direction', 'sel-justify-content', 'sel-align-items', 'sel-flex-wrap'];
const cssPropNames = ['flex-direction', 'justify-content', 'align-items', 'flex-wrap'];

const defaultSelections = {
  'sel-flex-direction':  'row',
  'sel-justify-content': 'flex-start',
  'sel-align-items':     'flex-start',
  'sel-flex-wrap':       'nowrap'
};

let currentStep = 0;
const stepCompleted  = Array(steps.length).fill(false);
const stepSelections = steps.map(() => ({ ...defaultSelections }));
const stepAttempts   = Array(steps.length).fill(0);

function init() {
  renderDots();
  loadStep(currentStep);
}

function loadStep(index) {
  const step = steps[index];

  document.getElementById('step-num').textContent = index + 1;
  document.getElementById('goal-text').textContent = step.goal;

  selectIds.forEach(id => {
    document.getElementById(id).value = stepSelections[index][id];
  });

  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';

  const checkBtn = document.getElementById('check-btn');
  if (stepCompleted[index]) {
    checkBtn.textContent = '← עבור לשלב הבא';
    checkBtn.onclick = nextStep;
  } else {
    checkBtn.textContent = '✔ בדוק פתרון';
    checkBtn.onclick = checkSolution;
  }

  document.getElementById('next-btn').disabled = !stepCompleted[index];
  document.getElementById('prev-btn').disabled = index === 0;

  const pct = (index / steps.length) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';

  document.body.style.backgroundColor = stepBg[index].page;
  document.getElementById('arena-wrapper').style.background = stepBg[index].arena;

  applyExpectedToTarget(index);
  applySelectsToContainer();
  updateAttempts();
  updateDots();
}

function applyExpectedToTarget(index) {
  const target   = document.getElementById('flex-target');
  const expected = steps[index].expected;
  target.style.cssText = '';
  target.style.position = 'absolute';
  target.style.inset    = '0';
  target.style.display  = 'flex';
  target.style.padding  = '16px';
  target.style.zIndex   = '1';
  target.style.pointerEvents = 'none';
  cssPropNames.forEach((cssProp, i) => {
    target.style.setProperty(cssProp, expected[selectIds[i]]);
  });
}

function onSelectChange() {
  applySelectsToContainer();
  const feedback = document.getElementById('feedback');
  if (feedback.classList.contains('error')) {
    feedback.textContent = '';
    feedback.className = 'feedback';
  }
}

function updateAttempts() {
  const n  = stepAttempts[currentStep];
  const el = document.getElementById('attempts');
  el.textContent = n > 0 ? `ניסיונות: ${n}` : '';
}

function applySelectsToContainer() {
  const container = document.getElementById('flex-container');
  container.style.cssText  = '';
  container.style.position = 'absolute';
  container.style.inset    = '0';
  container.style.display  = 'flex';
  container.style.padding  = '16px';
  container.style.zIndex   = '2';

  cssPropNames.forEach((cssProp, i) => {
    const val = document.getElementById(selectIds[i]).value;
    if (val) container.style.setProperty(cssProp, val);
  });
}

function checkSolution() {
  if (stepCompleted[currentStep]) return;

  stepAttempts[currentStep]++;
  updateAttempts();

  selectIds.forEach(id => {
    stepSelections[currentStep][id] = document.getElementById(id).value;
  });

  applySelectsToContainer();

  const hotdog = document.getElementById('hotdog-img');
  const bun    = document.getElementById('bun-img');
  const hRect  = hotdog.getBoundingClientRect();
  const bRect  = bun.getBoundingClientRect();

  const hCx = hRect.left + hRect.width  / 2;
  const hCy = hRect.top  + hRect.height / 2;
  const bCx = bRect.left + bRect.width  / 2;
  const bCy = bRect.top  + bRect.height / 2;
  const dist = Math.sqrt((hCx - bCx) ** 2 + (hCy - bCy) ** 2);

  const feedback = document.getElementById('feedback');

  if (dist < 15) {
    stepCompleted[currentStep] = true;
    feedback.textContent = '✅ מעולה! הנקניקייה על הלחמנייה!';
    feedback.className   = 'feedback success';
    document.getElementById('next-btn').disabled = false;
    const checkBtn = document.getElementById('check-btn');
    checkBtn.textContent = '← עבור לשלב הבא';
    checkBtn.onclick = nextStep;
    updateDots();
    const pct = ((currentStep + 1) / steps.length) * 100;
    document.getElementById('progress-fill').style.width = pct + '%';
  } else {
    feedback.textContent = '❌ לא נכון... שנה ערך ונסה שוב!';
    feedback.className   = 'feedback error';
  }
}

function resetStep() {
  selectIds.forEach(id => {
    document.getElementById(id).value  = defaultSelections[id];
    stepSelections[currentStep][id]    = defaultSelections[id];
  });
  applySelectsToContainer();
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';
}

function nextStep() {
  if (currentStep >= steps.length - 1) {
    document.getElementById('success-overlay').classList.remove('hidden');
    return;
  }
  currentStep++;
  loadStep(currentStep);
}

function prevStep() {
  if (currentStep <= 0) return;
  currentStep--;
  loadStep(currentStep);
}

function restartGame() {
  currentStep = 0;
  stepCompleted.fill(false);
  stepAttempts.fill(0);
  steps.forEach((_, i) => { stepSelections[i] = { ...defaultSelections }; });
  document.getElementById('success-overlay').classList.add('hidden');
  loadStep(0);
}

function renderDots() {
  const dotsEl = document.getElementById('dots');
  dotsEl.innerHTML = '';
  steps.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.id = 'dot-' + i;
    dotsEl.appendChild(dot);
  });
}

function updateDots() {
  steps.forEach((_, i) => {
    const dot = document.getElementById('dot-' + i);
    dot.className = 'dot';
    if (stepCompleted[i])       dot.classList.add('completed');
    else if (i === currentStep) dot.classList.add('current');
  });
}

init();
