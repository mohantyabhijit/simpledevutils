const countEl  = document.getElementById('uuid-count');
const listEl   = document.getElementById('uuid-list');
const msgEl    = document.getElementById('uuid-msg');

let generatedUUIDs = [];

function generateUUIDs() {
  const count = Math.min(Math.max(parseInt(countEl.value, 10) || 1, 1), 100);
  generatedUUIDs = Array.from({ length: count }, () => crypto.randomUUID());
  renderList();
  showMessage(msgEl, `Generated ${count} UUID${count > 1 ? 's' : ''}.`, 'success');
}

function renderList() {
  listEl.textContent = '';
  generatedUUIDs.forEach(uuid => {
    const item = document.createElement('div');
    item.className = 'uuid-item';

    const code = document.createElement('code');
    code.textContent = uuid;

    const hint = document.createElement('span');
    hint.className = 'uuid-item__hint';
    hint.textContent = 'click to copy';

    item.appendChild(code);
    item.appendChild(hint);

    item.addEventListener('click', () => {
      copyToClipboard(uuid)
        .then(() => showMessage(msgEl, 'UUID copied.', 'success'))
        .catch(() => showMessage(msgEl, 'Copy failed.', 'error'));
    });

    listEl.appendChild(item);
  });
}

function copyAll() {
  if (!generatedUUIDs.length) {
    showMessage(msgEl, 'Generate some UUIDs first.', 'error');
    return;
  }
  copyToClipboard(generatedUUIDs.join('\n'))
    .then(() => showMessage(msgEl, 'All UUIDs copied.', 'success'))
    .catch(() => showMessage(msgEl, 'Copy failed.', 'error'));
}

function clearAll() {
  generatedUUIDs = [];
  listEl.textContent = '';
  msgEl.className = 'tool-msg';
  msgEl.textContent = '';
}

document.getElementById('btn-generate').addEventListener('click', generateUUIDs);
document.getElementById('btn-copy-all').addEventListener('click', copyAll);
document.getElementById('btn-clear').addEventListener('click', clearAll);

// Generate one UUID on load
generateUUIDs();
