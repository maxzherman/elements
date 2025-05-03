let discovered = [];
let selected = [];
let combinations = [];
let introMessage = "";
let hiddenEnding = {};
let discoveryPaths = {};

async function loadGame() {
  const response = await fetch('elements.json');
  const data = await response.json();
  introMessage = data.intro_message;
  combinations = data.combinations;
  hiddenEnding = data.hidden_ending;

  // Load saved progress if it exists
  const savedDiscovered = JSON.parse(localStorage.getItem('discovered'));
  const savedDiscoveryPaths = JSON.parse(localStorage.getItem('discoveryPaths'));

  if (savedDiscovered && savedDiscoveryPaths) {
    discovered = savedDiscovered;
    discoveryPaths = savedDiscoveryPaths;
  } else {
    discovered = [...data.elements];
  }

  document.getElementById('intro').innerText = introMessage;
  renderElements();
  renderDiscovered();
  updateCounter();
}

function saveProgress() {
  localStorage.setItem('discovered', JSON.stringify(discovered));
  localStorage.setItem('discoveryPaths', JSON.stringify(discoveryPaths));
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

  if (selected.length === 2) {
    tryCombine();
  }
}

function tryCombine() {
  const [first, second] = selected;
  const found = combinations.find(combo => {
    return combo.input.includes(first) && combo.input.includes(second);
  });

  if (found) {
    if (!discovered.includes(found.result)) {
      discovered.push(found.result);
      discoveryPaths[found.result] = [first, second];
      showSpecialMessage(`You discovered: ${found.result} 🎉`);
      startConfetti();
      renderElements();
      renderDiscovered();
      updateCounter();
      saveProgress(); // <-- Save after discovery!

      if (found.result === hiddenEnding.result) {
        showSpecialMessage(hiddenEnding.message);
      }
    }
  } else {
    showSpecialMessage('Nothing happened... Try different combinations!');
  }

  selected = [];
  document.getElementById('selection').innerText = 'None';
}

function showSpecialMessage(text) {
  const messageDiv = document.getElementById('specialMessage');
  messageDiv.innerText = text;
  messageDiv.style.opacity = 1;

  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 3000);
}

function updateCounter() {
  const counter = document.getElementById('counter');
  const totalElements = new Set([
    ...combinations.flatMap(c => c.input),
    ...combinations.map(c => c.result)
  ]).size;

  counter.innerText = `Discovered ${discovered.length} / ${totalElements} elements`;
}

function startConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  const confettiCount = 150;
  const confetti = [];

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * confettiCount,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncrement: (Math.random() * 0.07) + 0.05,
      tiltAngle: 0
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(c => {
      ctx.beginPath();
      ctx.lineWidth = c.r;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt + (c.r / 2), c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.tilt + (c.r / 2));
      ctx.stroke();
    });

    update();
  }

  function update() {
    confetti.forEach(c => {
      c.tiltAngle += c.tiltAngleIncrement;
      c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
      c.x += Math.sin(c.d);
      c.tilt = Math.sin(c.tiltAngle) * 15;
    });
  }

  function loop() {
    draw();
    requestAnimationFrame(loop);
  }

  loop();

  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 3000);
}

// Optional: Add Reset Progress
function resetProgress() {
  if (confirm('Are you sure you want to reset all progress?')) {
    localStorage.removeItem('discovered');
    localStorage.removeItem('discoveryPaths');
    location.reload();
  }
}

// Attach reset function to a button if you want
// Example:
// <button onclick="resetProgress()">Reset Progress</button>

loadGame();
