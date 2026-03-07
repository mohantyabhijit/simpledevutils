const unixInputEl  = document.getElementById('ts-unix-input');
const unixResultEl = document.getElementById('ts-unix-result');
const dateInputEl  = document.getElementById('ts-date-input');
const dateResultEl = document.getElementById('ts-date-result');
const msgEl        = document.getElementById('ts-msg');

function unixToDate() {
  const val = unixInputEl.value.trim();
  if (!val) { showMessage(msgEl, 'Enter a Unix timestamp.', 'error'); return; }

  const ms = /^\d{10}$/.test(val)
    ? parseInt(val, 10) * 1000   // seconds
    : parseInt(val, 10);          // milliseconds if longer

  const d = new Date(ms);
  if (isNaN(d.getTime())) { showMessage(msgEl, 'Invalid timestamp.', 'error'); return; }

  unixResultEl.textContent = [
    'UTC:   ' + d.toUTCString(),
    'Local: ' + d.toLocaleString(),
    'ISO:   ' + d.toISOString(),
  ].join('\n');
}

function dateToUnix() {
  const val = dateInputEl.value.trim();
  if (!val) { showMessage(msgEl, 'Enter a date/time string.', 'error'); return; }

  const d = new Date(val);
  if (isNaN(d.getTime())) { showMessage(msgEl, 'Could not parse date string.', 'error'); return; }

  dateResultEl.textContent = [
    'Unix (s):  ' + Math.floor(d.getTime() / 1000),
    'Unix (ms): ' + d.getTime(),
  ].join('\n');
}

function setNow() {
  const now = new Date();
  unixInputEl.value = Math.floor(now.getTime() / 1000);
  unixToDate();
}

document.getElementById('btn-unix-convert').addEventListener('click', unixToDate);
document.getElementById('btn-date-convert').addEventListener('click', dateToUnix);
document.getElementById('btn-now').addEventListener('click', setNow);

// Set current time on load
setNow();
