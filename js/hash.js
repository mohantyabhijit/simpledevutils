const inputEl = document.getElementById('hash-input');
const msgEl   = document.getElementById('hash-msg');

const ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

async function hashText(algorithm, text) {
  const data = new TextEncoder().encode(text);
  const buf  = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function generateHashes() {
  const text = inputEl.value;
  if (!text) { showMessage(msgEl, 'Enter some text first.', 'error'); return; }

  showMessage(msgEl, 'Hashing...', 'success');

  for (const algo of ALGORITHMS) {
    const id = 'hash-' + algo.toLowerCase().replace('-', '');
    const el = document.getElementById(id);
    if (el) {
      el.textContent = 'computing...';
      try {
        el.textContent = await hashText(algo, text);
      } catch (err) {
        el.textContent = 'Error: ' + err.message;
      }
    }
  }

  showMessage(msgEl, 'Hashes generated.', 'success');
}

function clearAll() {
  inputEl.value = '';
  ALGORITHMS.forEach(algo => {
    const id = 'hash-' + algo.toLowerCase().replace('-', '');
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  msgEl.className = 'tool-msg';
  msgEl.textContent = '';
}

function copyHash(algo) {
  const id = 'hash-' + algo.toLowerCase().replace('-', '');
  const text = document.getElementById(id).textContent;
  if (!text || text === 'computing...') { showMessage(msgEl, 'Nothing to copy.', 'error'); return; }
  copyToClipboard(text)
    .then(() => showMessage(msgEl, algo + ' hash copied.', 'success'))
    .catch(() => showMessage(msgEl, 'Copy failed.', 'error'));
}

document.getElementById('btn-hash').addEventListener('click', generateHashes);
document.getElementById('btn-clear').addEventListener('click', clearAll);

// Copy buttons per algorithm
ALGORITHMS.forEach(algo => {
  const btnId = 'copy-' + algo.toLowerCase().replace('-', '');
  const btn = document.getElementById(btnId);
  if (btn) btn.addEventListener('click', () => copyHash(algo));
});
