let discovered = [];
let selected = [];
let combinations = [];
let introMessage = "";
let hiddenEnding = {};
let tips = [];
let shownTips = new Set();

async function loadGame() {
  const response = await fetch('elements.json');
  const data = await response.json();
  introMessage = data.intro_message;
  combinations = data.combinations;
  hiddenEnding = data.hidden_ending;
  tips = data.tips || [];

  const savedDiscovered = JSON.parse(localStorage.getItem('discovered'));
  const savedDiscoveryPaths = JSON.parse(localStorage.getItem('discoveryPaths'));
  const savedShownTips = JSON.parse(localStorage.getItem('shownTips'));

  if (savedDiscovered && savedDiscoveryPaths) {
    discovered = savedDiscovered;
    discoveryPaths = savedDiscoveryPaths;
  } else {
    discovered = [...data.elements];
  }

  shownTips = savedShownTips ? new Set(savedShownTips) : new Set();

  document.getElementById('intro').innerText = introMessage;
  renderElements();
  renderDiscovered();
  updateCounter();
}

function saveProgress() {
  localStorage.setItem('discovered', JSON.stringify(discovered));
  localStorage.setItem('discoveryPaths', JSON.stringify(discoveryPaths));
  localStorage.setItem('shownTips', JSON.stringify([...shownTips]));
}

function renderElements() {
  const container = document.getElementById('elements');
  container.innerHTML = '';
  discovered.forEach(element => {
    const button = document.createElement('button');
    button.innerText = element;
    button.onclick = () => selectElement(element);
    container.appendChild(button);
  });
}

function renderDiscovered() {
  const list = document.getElementById('discovered');
  list.innerHTML = '';
  discovered.forEach(element => {
    const li = document.createElement('li');
    if (discoveryPaths[element]) {
      li.innerText = `${element} (${discoveryPaths[element][0]} + ${discoveryPaths[element][1]})`;
    } else {
      li.innerText = element;
    }
    list.appendChild(li);
  });
}

function selectElement(element) {
  if (selected.length < 2) {
    selected.push(element);
    document.getElementById('selection').innerText = selected.join(' + ');
  }
  if (selected.length === 2) tryCombine();
}

function tryCombine() {
  const [first, second] = selected;
  const found = combinations.find(c =>
    c.input.includes(first) && c.input.includes(second)
  );
  if (found && !discovered.includes(found.result)) {
    discovered.push(found.result);
    discoveryPaths[found.result] = [first, second];
    showSpecialMessage(`You discovered: ${found.result} 🎉`);
    startConfetti();
    renderElements();
    renderDiscovered();
    updateCounter();
    saveProgress();
    checkTips(found.result);

    if (found.result === hiddenEnding.result) {
      showSpecialMessage(hiddenEnding.message);
    }
  } else if (!found) {
    showSpecialMessage('Nothing happened... Try different combinations!');
  }

  selected = [];
  document.getElementById('selection').innerText = 'None';
}

function checkTips(justUnlocked) {
  const count = discovered.length;
  tips.forEach((tip, i) => {
    if (shownTips.has(i)) return;
    const trg = tip.trigger;
    if (
      (trg.count != null && count === trg.count) ||
      (trg.element && trg.element === justUnlocked)
    ) {
      showSpecialMessage(tip.message);
      shownTips.add(i);
    }
  });
  saveProgress();
}

function showSpecialMessage(text) {
  const messageDiv = document.getElementById('specialMessage');
  messageDiv.innerText = text;
  messageDiv.style.opacity = 1;
  setTimeout(() => { messageDiv.style.opacity = 0; }, 3000);
}

function updateCounter() {
  const counter = document.getElementById('counter');
  const totalElements = new Set([
    ...combinations.flatMap(c => c.input),
    ...combinations.map(c => c.result)
  ]).size;
  counter.innerText = `Discovered ${discovered.length} / ${totalElements} elements`;
}

// ... confetti, resetProgress, unlockAllElements remain unchanged ...

loadGame();
