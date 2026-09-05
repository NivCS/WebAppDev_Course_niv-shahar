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
    goal: "הזז את שלוש הקופסאות לצד הימני של המיכל.",
    items: [
      { label: '1', color: '#e74c3c' },
      { label: '2', color: '#3498db' },
      { label: '3', color: '#2ecc71' }
    ],
    expected: {
      'sel-flex-direction':  'row',
      'sel-justify-content': 'flex-end',
      'sel-align-items':     'stretch',
      'sel-flex-wrap':       'nowrap'
    }
  },
  {
    goal: "מרכז את הקופסאות לאמצע המיכל (אופקית).",
    items: [
      { label: 'A', color: '#9b59b6' },
      { label: 'B', color: '#f39c12' },
      { label: 'C', color: '#1abc9c' }
    ],
    expected: {
      'sel-flex-direction':  'row',
      'sel-justify-content': 'center',
      'sel-align-items':     'stretch',
      'sel-flex-wrap':       'nowrap'
    }
  },
  {
    goal: "סדר את הקופסאות בעמודה אנכית — אחת מתחת לשנייה.",
    items: [
      { label: 'X', color: '#e74c3c' },
      { label: 'Y', color: '#e67e22' },
      { label: 'Z', color: '#27ae60' }
    ],
    expected: {
      'sel-flex-direction':  'column',
      'sel-justify-content': 'flex-start',
      'sel-align-items':     'stretch',
      'sel-flex-wrap':       'nowrap'
    }
  },
  {
    goal: "הזז את הקופסאות לתחתית המיכל (ציר אנכי).",
    items: [
      { label: '🐸', color: '#16a085', height: '55px' },
      { label: '🌟', color: '#8e44ad', height: '85px' },
      { label: '🚀', color: '#c0392b', height: '65px' }
    ],
    expected: {
      'sel-flex-direction':  'row',
      'sel-justify-content': 'flex-start',
      'sel-align-items':     'flex-end',
      'sel-flex-wrap':       'nowrap'
    }
  },
  {
    goal: "פזר את הקופסאות כך שיהיה רווח שווה ביניהן — ללא רווח בקצוות.",
    items: [
      { label: '1', color: '#e74c3c' },
      { label: '2', color: '#3498db' },
      { label: '3', color: '#f1c40f' },
      { label: '4', color: '#2ecc71' }
    ],
    expected: {
      'sel-flex-direction':  'row',
      'sel-justify-content': 'space-between',
      'sel-align-items':     'stretch',
      'sel-flex-wrap':       'nowrap'
    }
  },
  {
    goal: "גרום לקופסאות לעבור לשורה הבאה כשאין מקום, ומרכז אותן אופקית.",
    items: [
      { label: 'A', color: '#e74c3c', width: '110px' },
      { label: 'B', color: '#3498db', width: '110px' },
      { label: 'C', color: '#2ecc71', width: '110px' },
      { label: 'D', color: '#f1c40f', width: '110px' },
      { label: 'E', color: '#9b59b6', width: '110px' },
      { label: 'F', color: '#1abc9c', width: '110px' }
    ],
    expected: {
      'sel-flex-direction':  'row',
      'sel-justify-content': 'center',
      'sel-align-items':     'stretch',
      'sel-flex-wrap':       'wrap'
    }
  }
];

const selectIds    = ['sel-flex-direction', 'sel-justify-content', 'sel-align-items', 'sel-flex-wrap'];
const cssPropNames = ['flex-direction', 'justify-content', 'align-items', 'flex-wrap'];

const defaultSelections = {
  'sel-flex-direction':  'row',
  'sel-justify-content': 'flex-start',
  'sel-align-items':     'stretch',
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

  document.body.style.background = stepBg[index].page;
  document.getElementById('flex-container').style.background = stepBg[index].arena;

  renderItems(step);
  applySelectsToContainer();
  updateAttempts();
  updateDots();
}

function renderItems(step) {
  const container = document.getElementById('flex-container');
  container.innerHTML = '';
  step.items.forEach(item => {
    const box = document.createElement('div');
    box.className = 'box';
    box.textContent = item.label;
    box.style.background = item.color;
    if (item.height) box.style.minHeight = item.height;
    if (item.width)  box.style.minWidth  = item.width;
    container.appendChild(box);
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
  const n = stepAttempts[currentStep];
  const el = document.getElementById('attempts');
  el.textContent = n > 0 ? `ניסיונות: ${n}` : '';
}

function applySelectsToContainer() {
  const container = document.getElementById('flex-container');
  const bg = stepBg[currentStep].arena;
  container.style.cssText = '';
  container.style.display    = 'flex';
  container.style.gap        = '10px';
  container.style.padding    = '16px';
  container.style.minHeight  = '260px';
  container.style.background = bg;

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

  const expected = steps[currentStep].expected;
  const feedback = document.getElementById('feedback');

  const allMatch = selectIds.every(id => {
    return document.getElementById(id).value === expected[id];
  });

  if (allMatch) {
    stepCompleted[currentStep] = true;
    feedback.textContent = '✅ מעולה! עברת את השלב!';
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
    document.getElementById(id).value = defaultSelections[id];
    stepSelections[currentStep][id]   = defaultSelections[id];
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
    if (stepCompleted[i])    dot.classList.add('completed');
    else if (i === currentStep) dot.classList.add('current');
  });
}

init();
