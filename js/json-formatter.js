const inputEl  = document.getElementById('json-input');
const outputEl = document.getElementById('json-output');
const msgEl    = document.getElementById('json-msg');

function formatJSON() {
  const raw = inputEl.value.trim();
  if (!raw) { showMessage(msgEl, 'Paste some JSON first.', 'error'); return; }
  try {
    const parsed = JSON.parse(raw);
    outputEl.value = JSON.stringify(parsed, null, 2);
    showMessage(msgEl, 'Formatted successfully.', 'success');
  } catch (err) {
    const match = err.message.match(/position (\d+)/);
    if (match) {
      const pos = parseInt(match[1], 10);
      const line = raw.slice(0, pos).split('\n').length;
      showMessage(msgEl, `JSON error on line ${line}: ${err.message}`, 'error');
    } else {
      showMessage(msgEl, err.message, 'error');
    }
  }
}

function minifyJSON() {
  const raw = inputEl.value.trim();
  if (!raw) { showMessage(msgEl, 'Paste some JSON first.', 'error'); return; }
  try {
    const parsed = JSON.parse(raw);
    outputEl.value = JSON.stringify(parsed);
    showMessage(msgEl, 'Minified successfully.', 'success');
  } catch (err) {
    showMessage(msgEl, 'Invalid JSON: ' + err.message, 'error');
  }
}

function clearAll() {
  inputEl.value = '';
  outputEl.value = '';
  msgEl.className = 'tool-msg';
  msgEl.textContent = '';
}

function copyOutput() {
  const text = outputEl.value;
  if (!text) { showMessage(msgEl, 'Nothing to copy.', 'error'); return; }
  copyToClipboard(text)
    .then(() => showMessage(msgEl, 'Copied to clipboard.', 'success'))
    .catch(() => showMessage(msgEl, 'Copy failed.', 'error'));
}

function downloadOutput() {
  const text = outputEl.value;
  if (!text) { showMessage(msgEl, 'Nothing to download.', 'error'); return; }
  downloadText('output.json', text);
}

document.getElementById('btn-format').addEventListener('click', formatJSON);
document.getElementById('btn-minify').addEventListener('click', minifyJSON);
document.getElementById('btn-clear').addEventListener('click', clearAll);
document.getElementById('btn-copy').addEventListener('click', copyOutput);
document.getElementById('btn-download').addEventListener('click', downloadOutput);
