const patternEl = document.getElementById('regex-pattern');
const testEl    = document.getElementById('regex-test');
const outputEl  = document.getElementById('regex-output');
const countEl   = document.getElementById('regex-count');
const groupsEl  = document.getElementById('regex-groups');
const msgEl     = document.getElementById('regex-msg');

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getFlags() {
  const flags = [];
  document.querySelectorAll('.regex-flag:checked').forEach(cb => flags.push(cb.value));
  // Always include 'g' for matchAll
  if (!flags.includes('g')) flags.push('g');
  return flags.join('');
}

function runRegex() {
  const pattern = patternEl.value;
  const text    = testEl.value;

  if (!pattern) {
    outputEl.innerHTML = escapeHtml(text);
    countEl.textContent  = '';
    groupsEl.textContent = '';
    return;
  }

  let re;
  try {
    re = new RegExp(pattern, getFlags());
  } catch (err) {
    showMessage(msgEl, 'Invalid regex: ' + err.message, 'error');
    outputEl.textContent = text;
    countEl.textContent  = '';
    groupsEl.textContent = '';
    return;
  }

  const matches = [...text.matchAll(re)];
  countEl.textContent = matches.length + ' match' + (matches.length !== 1 ? 'es' : '');

  // Group info
  if (matches.length > 0 && matches[0].length > 1) {
    const groupLines = matches.map((m, i) => {
      const groups = Array.from(m).slice(1);
      return `Match ${i + 1}: [${groups.map(g => g === undefined ? 'undefined' : JSON.stringify(g)).join(', ')}]`;
    });
    groupsEl.textContent = groupLines.join('\n');
  } else {
    groupsEl.textContent = '';
  }

  // Build highlighted HTML
  let html = '';
  let last = 0;
  for (const match of matches) {
    if (match.index > last) {
      html += escapeHtml(text.slice(last, match.index));
    }
    html += '<mark>' + escapeHtml(match[0]) + '</mark>';
    last = match.index + match[0].length;
    // Guard against zero-length matches to prevent infinite loop
    if (match[0].length === 0) {
      html += escapeHtml(text[last] || '');
      last++;
    }
  }
  html += escapeHtml(text.slice(last));

  outputEl.className = 'regex-output';
  outputEl.innerHTML = html;
}

patternEl.addEventListener('input', runRegex);
testEl.addEventListener('input', runRegex);
document.querySelectorAll('.regex-flag').forEach(cb => cb.addEventListener('change', runRegex));

function clearAll() {
  patternEl.value = '';
  testEl.value    = '';
  outputEl.textContent = '';
  countEl.textContent  = '';
  groupsEl.textContent = '';
  msgEl.className = 'tool-msg';
  msgEl.textContent = '';
}

document.getElementById('btn-clear').addEventListener('click', clearAll);
