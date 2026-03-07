const inputEl  = document.getElementById('b64-input');
const outputEl = document.getElementById('b64-output');
const msgEl    = document.getElementById('b64-msg');

function encodeBase64(str) {
  const bytes = new TextEncoder().encode(str);
  const binStr = Array.from(bytes, b => String.fromCharCode(b)).join('');
  return btoa(binStr);
}

function decodeBase64(str) {
  const binStr = atob(str);
  const bytes = Uint8Array.from(binStr, c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encode() {
  const text = inputEl.value;
  if (!text) { showMessage(msgEl, 'Enter some text first.', 'error'); return; }
  outputEl.value = encodeBase64(text);
  showMessage(msgEl, 'Encoded successfully.', 'success');
}

function decode() {
  const text = inputEl.value.trim();
  if (!text) { showMessage(msgEl, 'Enter a Base64 string first.', 'error'); return; }
  try {
    outputEl.value = decodeBase64(text);
    showMessage(msgEl, 'Decoded successfully.', 'success');
  } catch {
    showMessage(msgEl, 'Invalid Base64 input.', 'error');
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
