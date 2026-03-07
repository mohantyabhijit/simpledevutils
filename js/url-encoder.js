const inputEl  = document.getElementById('url-input');
const outputEl = document.getElementById('url-output');
const msgEl    = document.getElementById('url-msg');

function encode() {
  const text = inputEl.value;
  if (!text) { showMessage(msgEl, 'Enter some text first.', 'error'); return; }
  outputEl.value = encodeURIComponent(text);
  showMessage(msgEl, 'Encoded successfully.', 'success');
}

function decode() {
  const text = inputEl.value;
  if (!text) { showMessage(msgEl, 'Enter a URL-encoded string first.', 'error'); return; }
  try {
    outputEl.value = decodeURIComponent(text);
    showMessage(msgEl, 'Decoded successfully.', 'success');
  } catch {
    showMessage(msgEl, 'Invalid percent-encoded input.', 'error');
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

document.getElementById('btn-encode').addEventListener('click', encode);
document.getElementById('btn-decode').addEventListener('click', decode);
document.getElementById('btn-clear').addEventListener('click', clearAll);
document.getElementById('btn-copy').addEventListener('click', copyOutput);
