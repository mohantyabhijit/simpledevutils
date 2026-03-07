/**
 * Shared utilities for SimpleDevUtils tool pages.
 */

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback for non-secure contexts
  const el = document.createElement('textarea');
  el.value = text;
  el.style.position = 'fixed';
  el.style.opacity = '0';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  return Promise.resolve();
}

function downloadText(filename, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Show a temporary status message in an element.
 * @param {HTMLElement} el
 * @param {string} msg
 * @param {'success'|'error'} type
 */
function showMessage(el, msg, type) {
  el.textContent = msg;
  el.className = 'tool-msg ' + type;
  clearTimeout(el._msgTimer);
  el._msgTimer = setTimeout(() => {
    el.className = 'tool-msg';
    el.textContent = '';
  }, 3000);
}
