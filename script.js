const steps = [
  {
    goal: "הזז את שלוש הקופסאות לצד הימני של המיכל.",
    hint: "justify-content: flex-end;",
    items: [
      { label: '1', color: '#e74c3c' },
      { label: '2', color: '#3498db' },
      { label: '3', color: '#2ecc71' }
    ],
    expected: { justifyContent: 'flex-end' }
  },
  {
    goal: "מרכז את הקופסאות לאמצע המיכל (אופקית).",
    hint: "justify-content: center;",
    items: [
      { label: 'A', color: '#9b59b6' },
      { label: 'B', color: '#f39c12' },
      { label: 'C', color: '#1abc9c' }
    ],
    expected: { justifyContent: 'center' }
  },
  {
    goal: "סדר את הקופסאות בעמודה אנכית — אחת מתחת לשנייה.",
    hint: "flex-direction: column;",
    items: [
      { label: 'X', color: '#e74c3c' },
      { label: 'Y', color: '#e67e22' },
      { label: 'Z', color: '#27ae60' }
    ],
    expected: { flexDirection: 'column' }
  },
  {
    goal: "הזז את הקופסאות לתחתית המיכל (ציר אנכי).",
    hint: "align-items: flex-end;",
    items: [
      { label: '🐸', color: '#16a085', height: '55px' },
      { label: '🌟', color: '#8e44ad', height: '85px' },
      { label: '🚀', color: '#c0392b', height: '65px' }
    ],
    expected: { alignItems: 'flex-end' }
  },
  {
    goal: "פזר את הקופסאות כך שיהיה רווח שווה ביניהן — ללא רווח בקצוות.",
    hint: "justify-content: space-between;",
    items: [
      { label: '1', color: '#e74c3c' },
      { label: '2', color: '#3498db' },
      { label: '3', color: '#f1c40f' },
      { label: '4', color: '#2ecc71' }
    ],
    expected: { justifyContent: 'space-between' }
  },
  {
    goal: "גרום לקופסאות לעבור לשורה הבאה כשאין מקום, ומרכז אותן אופקית.",
    hint: "flex-wrap: wrap;\njustify-content: center;",
    items: [
      { label: 'A', color: '#e74c3c',  width: '110px' },
      { label: 'B', color: '#3498db',  width: '110px' },
      { label: 'C', color: '#2ecc71',  width: '110px' },
      { label: 'D', color: '#f1c40f',  width: '110px' },
      { label: 'E', color: '#9b59b6',  width: '110px' },
      { label: 'F', color: '#1abc9c',  width: '110px' }
    ],
    expected: { flexWrap: 'wrap', justifyContent: 'center' }
  }
];

const selectIds = ['sel-flex-direction', 'sel-justify-content', 'sel-align-items', 'sel-flex-wrap'];
const selectProps = ['flexDirection', 'justifyContent', 'alignItems', 'flexWrap'];
const cssPropNames = ['flex-direction', 'justify-content', 'align-items', 'flex-wrap'];

let currentStep = 0;
const stepCompleted = Array(steps.length).fill(false);
const stepSelections = steps.map(() => ({ 'sel-flex-direction': '', 'sel-justify-content': '', 'sel-align-items': '', 'sel-flex-wrap': '' }));

function init() {
  renderDots();
  loadStep(currentStep);
}

function loadStep(index) {
  const step = steps[index];

  document.getElementById('step-num').textContent = index + 1;
  document.getElementById('goal-text').textContent = step.goal;
  document.getElementById('hint-text').textContent = step.hint;
  document.getElementById('hint-box').classList.add('hidden');
  document.getElementById('hint-btn').textContent = '💡 רמז';

  selectIds.forEach(id => {
    document.getElementById(id).value = stepSelections[index][id] || '';
  });

  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';

  document.getElementById('next-btn').disabled = !stepCompleted[index];
  document.getElementById('prev-btn').disabled = index === 0;

  const pct = (index / steps.length) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';

  renderItems(step);
  applyCSS();
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

function applyCSS() {
  const container = document.getElementById('flex-container');

  container.style.cssText = '';
  container.style.display = 'flex';
  container.style.gap = '10px';
  container.style.padding = '12px';
  container.style.minHeight = '140px';

  cssPropNames.forEach((cssProp, i) => {
    const val = document.getElementById(selectIds[i]).value;
    if (val) container.style.setProperty(cssProp, val);
  });

  stepSelections[currentStep] = {};
  selectIds.forEach(id => {
    stepSelections[currentStep][id] = document.getElementById(id).value;
  });

  checkSuccess();
}

function checkSuccess() {
  if (stepCompleted[currentStep]) return;

  const container = document.getElementById('flex-container');
  const computed  = window.getComputedStyle(container);
  const expected  = steps[currentStep].expected;
  const feedback  = document.getElementById('feedback');

  const allMatch = Object.entries(expected).every(([prop, val]) => {
    return computed[prop] === val;
  });

  if (allMatch) {
    stepCompleted[currentStep] = true;
    feedback.textContent = '✅ מעולה! עברת את השלב!';
    feedback.className   = 'feedback success';
    document.getElementById('next-btn').disabled = false;
    updateDots();

    const pct = ((currentStep + 1) / steps.length) * 100;
    document.getElementById('progress-fill').style.width = pct + '%';
  } else {
    feedback.textContent = '';
    feedback.className   = 'feedback';
  }
}

function toggleHint() {
  const box = document.getElementById('hint-box');
  const btn = document.getElementById('hint-btn');
  const isHidden = box.classList.toggle('hidden');
  btn.textContent = isHidden ? '💡 רמז' : '🙈 הסתר רמז';
}

function resetStep() {
  selectIds.forEach(id => { document.getElementById(id).value = ''; });
  stepSelections[currentStep] = {};
  applyCSS();
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
  steps.forEach((_, i) => { stepSelections[i] = {}; });
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
    if (stepCompleted[i]) dot.classList.add('completed');
    else if (i === currentStep) dot.classList.add('current');
  });
}

init();
