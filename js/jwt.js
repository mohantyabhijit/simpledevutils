const tokenEl   = document.getElementById('jwt-input');
const headerEl  = document.getElementById('jwt-header');
const payloadEl = document.getElementById('jwt-payload');
const sigEl     = document.getElementById('jwt-sig');
const expiryEl  = document.getElementById('jwt-expiry');
const msgEl     = document.getElementById('jwt-msg');

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const binStr = atob(str);
  const bytes = Uint8Array.from(binStr, c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function decodeJWT() {
  const token = tokenEl.value.trim();
  if (!token) {
    showMessage(msgEl, 'Paste a JWT token first.', 'error');
    return;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    showMessage(msgEl, 'Invalid JWT: must have 3 parts separated by dots.', 'error');
    resetPanels();
    return;
  }

  try {
    const header  = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));

    headerEl.textContent  = JSON.stringify(header, null, 2);
    payloadEl.textContent = JSON.stringify(payload, null, 2);
    sigEl.textContent     = parts[2];

    // Expiry check
    expiryEl.className = 'jwt-expiry';
    expiryEl.textContent = '';

    if (payload.exp !== undefined) {
      const expDate = new Date(payload.exp * 1000);
      const now     = new Date();
      if (expDate < now) {
        expiryEl.className = 'jwt-expiry expired';
        expiryEl.textContent = `Expired: ${expDate.toUTCString()}`;
      } else {
        expiryEl.className = 'jwt-expiry valid';
        expiryEl.textContent = `Valid until: ${expDate.toUTCString()}`;
      }
    }

    showMessage(msgEl, 'Decoded successfully.', 'success');
  } catch (err) {
    showMessage(msgEl, 'Failed to decode JWT: ' + err.message, 'error');
    resetPanels();
  }
}

function resetPanels() {
  headerEl.textContent  = '';
  payloadEl.textContent = '';
  sigEl.textContent     = '';
  expiryEl.className    = 'jwt-expiry';
  expiryEl.textContent  = '';
}

function clearAll() {
  tokenEl.value = '';
  resetPanels();
  msgEl.className = 'tool-msg';
  msgEl.textContent = '';
}

function copyPayload() {
  const text = payloadEl.textContent;
  if (!text) { showMessage(msgEl, 'Nothing to copy.', 'error'); return; }
  copyToClipboard(text)
    .then(() => showMessage(msgEl, 'Payload copied.', 'success'))
    .catch(() => showMessage(msgEl, 'Copy failed.', 'error'));
}

document.getElementById('btn-decode').addEventListener('click', decodeJWT);
document.getElementById('btn-clear').addEventListener('click', clearAll);
document.getElementById('btn-copy-payload').addEventListener('click', copyPayload);
