const origEl   = document.getElementById('diff-orig');
const modEl    = document.getElementById('diff-mod');
const outputEl = document.getElementById('diff-output');
const statsEl  = document.getElementById('diff-stats');
const msgEl    = document.getElementById('diff-msg');

/**
 * Compute LCS of two arrays and return a sequence of diff operations.
 * Returns an array of {type: 'unchanged'|'added'|'removed', line: string}.
 */
function computeDiff(aLines, bLines) {
  const m = aLines.length;
  const n = bLines.length;

  // Build LCS table
  const dp = [];
  for (let i = 0; i <= m; i++) {
    dp.push(new Uint32Array(n + 1));
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (aLines[i - 1] === bLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = dp[i - 1][j] > dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1];
      }
    }
  }

  // Backtrack to build diff
  const ops = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aLines[i - 1] === bLines[j - 1]) {
      ops.unshift({ type: 'unchanged', line: aLines[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.unshift({ type: 'added', line: bLines[j - 1] });
      j--;
    } else {
      ops.unshift({ type: 'removed', line: aLines[i - 1] });
      i--;
    }
  }
  return ops;
}

function renderDiff() {
  const orig = origEl.value;
  const mod  = modEl.value;

  if (!orig && !mod) {
    outputEl.textContent = '';
    outputEl.innerHTML = '<div class="diff-empty">Paste text in both panels to compare.</div>';
    statsEl.textContent = '';
    return;
  }

  const aLines = orig.split('\n');
  const bLines = mod.split('\n');

  // Guard against very large inputs
  if (aLines.length + bLines.length > 4000) {
    showMessage(msgEl, 'Input too large: limit is 2000 lines per side.', 'error');
    return;
  }

  const ops = computeDiff(aLines, bLines);

  let added = 0, removed = 0;
  const frag = document.createDocumentFragment();

  ops.forEach(op => {
    const div = document.createElement('div');
    div.className = 'diff-line ' + op.type;
    const prefix = op.type === 'added' ? '+ ' : op.type === 'removed' ? '- ' : '  ';
    div.textContent = prefix + op.line;
    frag.appendChild(div);
    if (op.type === 'added') added++;
    if (op.type === 'removed') removed++;
  });

  outputEl.textContent = '';
  outputEl.appendChild(frag);
  statsEl.textContent = `+${added} added, -${removed} removed`;
}

function clearAll() {
  origEl.value = '';
  modEl.value  = '';
  outputEl.textContent = '';
  outputEl.innerHTML = '<div class="diff-empty">Paste text in both panels to compare.</div>';
  statsEl.textContent = '';
  msgEl.className = 'tool-msg';
  msgEl.textContent = '';
}

document.getElementById('btn-diff').addEventListener('click', renderDiff);
document.getElementById('btn-clear').addEventListener('click', clearAll);

// Init
outputEl.innerHTML = '<div class="diff-empty">Paste text in both panels to compare.</div>';
