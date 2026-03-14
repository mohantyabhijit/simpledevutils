const inputEl = document.getElementById("json-input");
const outputEl = document.getElementById("json-output");
const msgEl = document.getElementById("json-msg");
const treeEl = document.getElementById("json-tree");
const statsEl = document.getElementById("json-stats");
const indentSelect = document.getElementById("indent-select");
const autoFormatToggle = document.getElementById("auto-format-toggle");

/* ===== INDENTATION HELPER ===== */
function getIndent() {
  const v = indentSelect.value;
  return v === "tab" ? "\t" : parseInt(v, 10);
}

/* ===== FORMAT / BEAUTIFY ===== */
function formatJSON() {
  const raw = inputEl.value.trim();
  if (!raw) {
    showMessage(msgEl, "Paste some JSON first.", "error");
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    const indent = getIndent();
    outputEl.value = JSON.stringify(parsed, null, indent);
    showMessage(msgEl, "Beautified successfully.", "success");
    showStats(raw, outputEl.value, parsed);
    renderTree(parsed);
    saveToStorage(inputEl.value);
  } catch (err) {
    showParseError(raw, err);
  }
}

/* ===== MINIFY / UGLIFY ===== */
function minifyJSON() {
  const raw = inputEl.value.trim();
  if (!raw) {
    showMessage(msgEl, "Paste some JSON first.", "error");
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    outputEl.value = JSON.stringify(parsed);
    showMessage(msgEl, "Uglified successfully.", "success");
    showStats(raw, outputEl.value, parsed);
    renderTree(parsed);
    saveToStorage(inputEl.value);
  } catch (err) {
    showParseError(raw, err);
  }
}

/* ===== FIX JSON ===== */
function fixJSON() {
  const raw = inputEl.value.trim();
  if (!raw) {
    showMessage(msgEl, "Paste some JSON first.", "error");
    return;
  }

  // First check if it's already valid
  try {
    JSON.parse(raw);
    showMessage(msgEl, "JSON is already valid.", "success");
    return;
  } catch (_) {
    // needs fixing
  }

  let fixed = raw;

  // Remove trailing commas before } or ]
  fixed = fixed.replace(/,\s*([\]}])/g, "$1");

  // Add missing quotes around unquoted keys: { key: "value" } -> { "key": "value" }
  fixed = fixed.replace(
    /([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g,
    '$1"$2":'
  );

  // Replace single quotes with double quotes (for string values/keys)
  // Only replace single quotes that look like string delimiters
  fixed = fixed.replace(
    /:\s*'([^']*)'/g,
    ': "$1"'
  );
  fixed = fixed.replace(
    /([{,]\s*)'([^']+)'\s*:/g,
    '$1"$2":'
  );

  try {
    const parsed = JSON.parse(fixed);
    inputEl.value = fixed;
    const indent = getIndent();
    outputEl.value = JSON.stringify(parsed, null, indent);
    showMessage(msgEl, "JSON fixed and formatted.", "success");
    showStats(fixed, outputEl.value, parsed);
    renderTree(parsed);
    saveToStorage(fixed);
  } catch (err) {
    showMessage(msgEl, "Could not auto-fix: " + err.message, "error");
  }
}

/* ===== CLEAR ===== */
function clearAll() {
  inputEl.value = "";
  outputEl.value = "";
  treeEl.innerHTML = "";
  statsEl.textContent = "";
  msgEl.className = "tool-msg";
  msgEl.textContent = "";
  localStorage.removeItem("sdu_json_input");
}

/* ===== COPY ===== */
function copyOutput() {
  const text = outputEl.value;
  if (!text) {
    showMessage(msgEl, "Nothing to copy.", "error");
    return;
  }
  copyToClipboard(text)
    .then(() => showMessage(msgEl, "Copied to clipboard.", "success"))
    .catch(() => showMessage(msgEl, "Copy failed.", "error"));
}

/* ===== DOWNLOAD ===== */
function downloadOutput() {
  const text = outputEl.value;
  if (!text) {
    showMessage(msgEl, "Nothing to download.", "error");
    return;
  }
  downloadText("formatted.json", text);
}

/* ===== FILE UPLOAD ===== */
function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (ev) {
    inputEl.value = ev.target.result;
    showMessage(msgEl, "File loaded: " + file.name, "success");
    if (autoFormatToggle.checked) {
      formatJSON();
    }
  };
  reader.readAsText(file);
  // Reset so the same file can be re-uploaded
  e.target.value = "";
}

/* ===== SAMPLE DATA ===== */
function loadSample() {
  const sample = {
    name: "SimpleDevUtils",
    version: "1.0.0",
    description: "Privacy-first developer tools",
    tools: [
      { id: 1, name: "JSON Formatter", category: "encoding", popular: true },
      { id: 2, name: "Base64 Encoder", category: "encoding", popular: true },
      { id: 3, name: "JWT Decoder", category: "crypto", popular: false }
    ],
    config: {
      theme: "dark",
      indent: 2,
      autoFormat: true,
      storage: { type: "localStorage", maxSize: "5MB" }
    },
    metadata: {
      createdAt: "2026-01-15T10:30:00Z",
      updatedAt: "2026-03-14T08:00:00Z",
      tags: ["developer", "tools", "privacy", "open-source"],
      stats: { users: 12500, toolsUsed: 48200 }
    }
  };
  inputEl.value = JSON.stringify(sample);
  if (autoFormatToggle.checked) {
    formatJSON();
  } else {
    showMessage(msgEl, "Sample data loaded. Click Beautify to format.", "success");
  }
}

/* ===== ERROR DISPLAY ===== */
function showParseError(raw, err) {
  const match = err.message.match(/position (\d+)/);
  if (match) {
    const pos = parseInt(match[1], 10);
    const before = raw.slice(0, pos);
    const line = before.split("\n").length;
    const col = pos - before.lastIndexOf("\n");
    showMessage(
      msgEl,
      "Error on line " + line + ", col " + col + ": " + err.message,
      "error"
    );
  } else {
    showMessage(msgEl, "Invalid JSON: " + err.message, "error");
  }
}

/* ===== STATS BAR ===== */
function showStats(input, output, parsed) {
  const inputSize = new Blob([input]).size;
  const outputSize = new Blob([output]).size;
  const keys = countKeys(parsed);
  const depth = maxDepth(parsed);
  statsEl.textContent =
    "Input: " + formatBytes(inputSize) +
    "  |  Output: " + formatBytes(outputSize) +
    "  |  Keys: " + keys +
    "  |  Max depth: " + depth;
}

function countKeys(obj) {
  let count = 0;
  if (obj && typeof obj === "object") {
    if (Array.isArray(obj)) {
      obj.forEach(function (item) { count += countKeys(item); });
    } else {
      const ks = Object.keys(obj);
      count += ks.length;
      ks.forEach(function (k) { count += countKeys(obj[k]); });
    }
  }
  return count;
}

function maxDepth(obj) {
  if (!obj || typeof obj !== "object") return 0;
  let max = 0;
  const values = Array.isArray(obj) ? obj : Object.values(obj);
  values.forEach(function (v) {
    const d = maxDepth(v);
    if (d > max) max = d;
  });
  return max + 1;
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  return (bytes / 1024).toFixed(1) + " KB";
}

/* ===== TREE VIEW ===== */
function renderTree(data) {
  treeEl.innerHTML = "";
  const root = buildTreeNode("root", data, true);
  treeEl.appendChild(root);
}

function buildTreeNode(key, value, isRoot) {
  const wrapper = document.createElement("div");
  wrapper.className = "tree-node";

  if (value !== null && typeof value === "object") {
    const isArr = Array.isArray(value);
    const entries = isArr ? value : Object.entries(value);
    const count = isArr ? value.length : Object.keys(value).length;

    const toggle = document.createElement("div");
    toggle.className = "tree-toggle expanded";

    const arrow = document.createElement("span");
    arrow.className = "tree-arrow";
    arrow.textContent = "\u25BC";
    toggle.appendChild(arrow);

    if (!isRoot) {
      const keySpan = document.createElement("span");
      keySpan.className = "tree-key";
      keySpan.textContent = key;
      toggle.appendChild(keySpan);
      toggle.appendChild(document.createTextNode(": "));
    }

    const badge = document.createElement("span");
    badge.className = "tree-badge";
    badge.textContent = isArr
      ? "Array[" + count + "]"
      : "Object{" + count + "}";
    toggle.appendChild(badge);

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      const children = wrapper.querySelector(".tree-children");
      const expanded = toggle.classList.toggle("expanded");
      children.style.display = expanded ? "block" : "none";
      arrow.textContent = expanded ? "\u25BC" : "\u25B6";
    });

    wrapper.appendChild(toggle);

    const childrenDiv = document.createElement("div");
    childrenDiv.className = "tree-children";

    if (isArr) {
      value.forEach(function (item, i) {
        childrenDiv.appendChild(buildTreeNode(i, item, false));
      });
    } else {
      Object.entries(value).forEach(function (entry) {
        childrenDiv.appendChild(buildTreeNode(entry[0], entry[1], false));
      });
    }

    wrapper.appendChild(childrenDiv);
  } else {
    const leaf = document.createElement("div");
    leaf.className = "tree-leaf";

    const keySpan = document.createElement("span");
    keySpan.className = "tree-key";
    keySpan.textContent = key;
    leaf.appendChild(keySpan);
    leaf.appendChild(document.createTextNode(": "));

    const valSpan = document.createElement("span");
    if (value === null) {
      valSpan.className = "tree-null";
      valSpan.textContent = "null";
    } else if (typeof value === "boolean") {
      valSpan.className = "tree-bool";
      valSpan.textContent = String(value);
    } else if (typeof value === "number") {
      valSpan.className = "tree-number";
      valSpan.textContent = String(value);
    } else {
      valSpan.className = "tree-string";
      valSpan.textContent = '"' + value + '"';
    }
    leaf.appendChild(valSpan);
    wrapper.appendChild(leaf);
  }

  return wrapper;
}

/* ===== VIEW TAB SWITCHING ===== */
document.querySelectorAll(".json-view-tab").forEach(function (tab) {
  tab.addEventListener("click", function () {
    document.querySelectorAll(".json-view-tab").forEach(function (t) {
      t.classList.remove("active");
    });
    tab.classList.add("active");
    const view = tab.getAttribute("data-view");
    document.getElementById("output-raw").style.display =
      view === "raw" ? "block" : "none";
    document.getElementById("output-tree").style.display =
      view === "tree" ? "block" : "none";
  });
});

/* ===== LOCAL STORAGE ===== */
function saveToStorage(text) {
  try {
    localStorage.setItem("sdu_json_input", text);
  } catch (_) {
    // storage full or unavailable
  }
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem("sdu_json_input");
    if (saved) {
      inputEl.value = saved;
    }
  } catch (_) {
    // unavailable
  }
}

/* ===== AUTO-FORMAT ===== */
let autoFormatTimer = null;
inputEl.addEventListener("input", function () {
  if (!autoFormatToggle.checked) return;
  clearTimeout(autoFormatTimer);
  autoFormatTimer = setTimeout(formatJSON, 400);
});

/* ===== EVENT LISTENERS ===== */
document.getElementById("btn-format").addEventListener("click", formatJSON);
document.getElementById("btn-minify").addEventListener("click", minifyJSON);
document.getElementById("btn-fix").addEventListener("click", fixJSON);
document.getElementById("btn-clear").addEventListener("click", clearAll);
document.getElementById("btn-copy").addEventListener("click", copyOutput);
document.getElementById("btn-download").addEventListener("click", downloadOutput);
document.getElementById("btn-sample").addEventListener("click", loadSample);
document.getElementById("file-upload").addEventListener("change", handleFileUpload);

/* ===== INIT ===== */
loadFromStorage();
