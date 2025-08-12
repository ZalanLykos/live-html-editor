(() => {
  const code = document.getElementById('code');
  const preview = document.getElementById('preview');
  const themeBtn = document.getElementById('themeBtn');
  const fileBtn = document.getElementById('fileBtn');
  const fileContainer = document.getElementById('fileContainer');
  const fileSubmenu = document.getElementById('fileSubmenu');
  const newBtn = document.getElementById('newBtn');
  const openBtn = document.getElementById('openBtn');
  const saveBtn = document.getElementById('saveBtn');
  const saveAsBtn = document.getElementById('saveAsBtn');
  const prefsModal = document.getElementById('prefsModal');
  const overlay = document.getElementById('overlay');
  const prefsCloseBtn = document.getElementById('prefsCloseBtn');
  const prefsForm = document.getElementById('prefsForm');

  // Initial setup
  let currentTheme = localStorage.getItem('theme') || 'light';
  document.body.className = currentTheme;
  updateThemeBtn();

  // Update preview iframe content
  function updatePreview() {
    const content = code.value;
    preview.srcdoc = content;
  }

  // Debounce updatePreview to avoid excessive updates
  let updateTimeout;
  code.addEventListener('input', () => {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(updatePreview, 300);
  });

  // Initial preview render
  updatePreview();

  // Theme toggle button
  themeBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.className = currentTheme;
    localStorage.setItem('theme', currentTheme);
    updateThemeBtn();
  });
const textarea = document.getElementById('code');
const lineNumbers = document.getElementById('lineNumbers');

function updateLineNumbers() {
  // Check if textarea contains any non-whitespace characters
  if (textarea.value.trim() === '') {
    lineNumbers.textContent = ''; // No code, no numbers
    return;
  }

  const linesCount = textarea.value.split('\n').length;
  let lines = '';
  for (let i = 1; i <= linesCount; i++) {
    lines += i + '\n';
  }
  lineNumbers.textContent = lines;
}


function syncScroll() {
  lineNumbers.scrollTop = textarea.scrollTop;
}

// Initialize line numbers
updateLineNumbers();

// Event listeners
textarea.addEventListener('input', updateLineNumbers);
textarea.addEventListener('scroll', syncScroll);


  function updateThemeBtn() {
    themeBtn.setAttribute('aria-pressed', currentTheme === 'dark');
  }

  // File menu toggle
  fileBtn.addEventListener('click', () => {
    const expanded = fileBtn.getAttribute('aria-expanded') === 'true';
    fileBtn.setAttribute('aria-expanded', !expanded);
    fileContainer.classList.toggle('open');
  });

  // Close file menu if clicking outside
  document.addEventListener('click', (e) => {
    if (!fileContainer.contains(e.target)) {
      fileContainer.classList.remove('open');
      fileBtn.setAttribute('aria-expanded', false);
    }
  });

  // New file clears editor
  newBtn.addEventListener('click', () => {
    if(confirm('Clear the editor? Unsaved changes will be lost.')) {
      code.value = '';
      updatePreview();
      closeFileMenu();
    }
  });
// --- INSPECT ELEMENTS FEATURE ---

  // Add Inspect button dynamically in toolbar
const toolbar = document.getElementById('preview-header');
const inspectBtn = document.createElement('button');
inspectBtn.id = 'inspectBtn';
inspectBtn.textContent = 'Inspect Elements';
inspectBtn.setAttribute('aria-pressed', 'false');
inspectBtn.style.background = 'var(--btn-bg)';
toolbar.appendChild(inspectBtn);

let inspecting = false;
let highlightedLine = null; // Track last highlighted code line
let highlightTimeout = null;

// Utility: Clear any existing highlight in editor
function clearHighlight() {
  if (highlightedLine !== null) {
    const highlightedSpan = document.querySelector('.code-highlight');
    if (highlightedSpan) {
      highlightedSpan.classList.remove('code-highlight');
    }
    highlightedLine = null;
  }
}

// Utility: Highlight given line number in editor textarea
function highlightLine(lineNumber) {
  clearHighlight();

  const lines = code.value.split('\n');
  if (lineNumber < 1 || lineNumber > lines.length) return;

  let start = 0;
  for (let i = 0; i < lineNumber - 1; i++) {
    start += lines[i].length + 1; // +1 for newline
  }
  let end = start + lines[lineNumber - 1].length;

  code.focus();
  code.setSelectionRange(start, end);

  const lineHeight = parseInt(getComputedStyle(code).lineHeight);
  code.scrollTop = (lineNumber - 1) * lineHeight;

  highlightedLine = lineNumber;
}

function findLineForElement(element) {
  if (!element) return null;
  const html = element.outerHTML;
  const codeText = code.value;
  const index = codeText.indexOf(html);
  if (index === -1) {
    const tag = element.tagName.toLowerCase();
    const regex = new RegExp(`<${tag}[^>]*>`, 'i');
    const match = regex.exec(codeText);
    if (!match) return null;
    const idx = match.index;
    return codeText.slice(0, idx).split('\n').length;
  }
  return codeText.slice(0, index).split('\n').length;
}

function createHighlightBox() {
  const box = document.createElement('div');
  box.style.position = 'absolute';
  box.style.border = '2px solid #0078d4';
  box.style.backgroundColor = 'rgba(0, 120, 212, 0.2)';
  box.style.pointerEvents = 'none';
  box.style.zIndex = '9999';
  return box;
}

let highlightBox = null;

function onHoverPreview(e) {
  if (!inspecting) return;

  const doc = preview.contentDocument || preview.contentWindow.document;
  if (!highlightBox) {
    highlightBox = createHighlightBox();
    doc.body.appendChild(highlightBox);
  }

  const target = e.target;
  if (target === doc.body || target === highlightBox) {
    highlightBox.style.width = '0';
    highlightBox.style.height = '0';
    return;
  }

  const rect = target.getBoundingClientRect();
  highlightBox.style.top = rect.top + doc.defaultView.scrollY + 'px';
  highlightBox.style.left = rect.left + doc.defaultView.scrollX + 'px';
  highlightBox.style.width = rect.width + 'px';
  highlightBox.style.height = rect.height + 'px';
}

function onClickPreview(e) {
  if (!inspecting) return;

  e.preventDefault();
  e.stopPropagation();

  const line = findLineForElement(e.target);
  if (line) {
    highlightLine(line);
  }
}

// Inspect mode toggle handler with color toggle on button
inspectBtn.addEventListener('click', () => {
  inspecting = !inspecting;
  inspectBtn.setAttribute('aria-pressed', inspecting.toString());
  if (inspecting) {
    inspectBtn.style.background = 'red';  // Active = red
  } else {
    inspectBtn.style.background = 'var(--btn-bg)'; // Inactive = default
  }

  const doc = preview.contentDocument || preview.contentWindow.document;

  if (inspecting) {
    if (!highlightBox) {
      highlightBox = createHighlightBox();
    }
    if (!doc.body.contains(highlightBox)) {
      doc.body.appendChild(highlightBox);
    }

    doc.body.addEventListener('mousemove', onHoverPreview);
    doc.body.addEventListener('click', onClickPreview, true);

    preview.style.pointerEvents = 'auto';
    preview.style.cursor = 'crosshair';
  } else {
    if (highlightBox && highlightBox.parentNode) {
      highlightBox.parentNode.removeChild(highlightBox);
    }

    doc.body.removeEventListener('mousemove', onHoverPreview);
    doc.body.removeEventListener('click', onClickPreview, true);

    preview.style.pointerEvents = '';
    preview.style.cursor = '';

    clearHighlight();
  }
});



  function onHoverPreview(e) {
    e.preventDefault();
    const el = e.target;

    const doc = preview.contentDocument || preview.contentWindow.document;
    if (!highlightBox || !doc.body.contains(highlightBox)) return;

    if (el === doc.body || el === highlightBox) {
      highlightBox.style.width = '0';
      highlightBox.style.height = '0';
      return;
    }

    // Get element bounding rect relative to iframe viewport
    const rect = el.getBoundingClientRect();

    // Position highlight box over hovered element
    highlightBox.style.top = rect.top + 'px';
    highlightBox.style.left = rect.left + 'px';
    highlightBox.style.width = rect.width + 'px';
    highlightBox.style.height = rect.height + 'px';

    // Find corresponding line in code and highlight
    const line = findLineForElement(el);
    if (line !== null) {
      highlightLine(line);
    }
  }

  function onClickPreview(e) {
    e.preventDefault();
    e.stopPropagation();

    const el = e.target;
    if (!el) return;

    // Find corresponding line and keep highlight (do not clear)
    const line = findLineForElement(el);
    if (line !== null) {
      highlightLine(line);
    }

    // Exit inspect mode
    inspecting = false;
    inspectBtn.setAttribute('aria-pressed', 'false');
    inspectBtn.style.background = 'var(--btn-bg)';

    // Remove highlightBox and event listeners
    const doc = preview.contentDocument || preview.contentWindow.document;
    if (highlightBox && highlightBox.parentNode) {
      highlightBox.parentNode.removeChild(highlightBox);
    }
    doc.body.removeEventListener('mousemove', onHoverPreview);
    doc.body.removeEventListener('click', onClickPreview, true);

    preview.style.pointerEvents = '';
    preview.style.cursor = '';
  }


  // Open file input
  openBtn.addEventListener('click', () => {
    closeFileMenu();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html,.htm,.txt';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          code.value = ev.target.result;
          updatePreview();
        };
        reader.readAsText(file);
      }
    };
    input.click();
  });

  // Save file with fixed name
  saveBtn.addEventListener('click', () => {
    closeFileMenu();
    const filename = 'code.html';
    saveTextFile(filename, code.value);
  });

  // Save As with prompt for filename and format
  saveAsBtn.addEventListener('click', () => {
    closeFileMenu();
    let filename = prompt('Enter filename (with extension):', 'code.html');
    if(filename) {
      saveTextFile(filename, code.value);
    }
  });

  function saveTextFile(filename, text) {
    const blob = new Blob([text], {type: 'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function closeFileMenu() {
    fileContainer.classList.remove('open');
    fileBtn.setAttribute('aria-expanded', false);
  }

  // Resizable divider
(() => {
  const divider = document.getElementById('divider');
  const dragHandle = document.getElementById('drag-handle');
  const leftPanel = document.getElementById('left-panel');
  const rightPanel = document.getElementById('right-panel');

  let isDragging = false;

  dragHandle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
preview.style.pointerEvents = 'none';

  });



  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    // Calculate new width for left panel (50px minimum, 90% max)
    let newWidth = e.clientX;
    const minWidth = 50;
    const maxWidth = window.innerWidth * 0.9;
    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > maxWidth) newWidth = maxWidth;
    leftPanel.style.width = newWidth + 'px';
    // Right panel flex will adjust automatically
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
preview.style.pointerEvents = 'auto';

  });

})();



  // Elements panel
  const elementsHeader = document.getElementById('elements-header');
  const elementsList = document.getElementById('elements-list');
  let elementsExpanded = true;

  // Common HTML elements to insert
  const htmlElements = ['div', 'span', 'p', 'a', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'tr', 'td', 'th', 'button', 'input', 'form', 'img', 'section', 'article', 'header', 'footer', 'nav', 'main', 'aside'];

  // Populate elements list
  htmlElements.forEach(tag => {
    const btn = document.createElement('button');
    btn.textContent = `<${tag}>`;
    btn.setAttribute('aria-label', `Insert <${tag}> element`);
    btn.addEventListener('click', () => {
      insertAtCursor(`<${tag}></${tag}>`);
      code.focus();
      updatePreview();
    });
    elementsList.appendChild(btn);
  });

  elementsHeader.addEventListener('click', toggleElements);
  elementsHeader.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleElements();
    }
  });


  // Insert text at cursor in textarea
  function insertAtCursor(text) {
    const start = code.selectionStart;
    const end = code.selectionEnd;
    const before = code.value.substring(0, start);
    const after = code.value.substring(end);
    code.value = before + text + after;
    code.selectionStart = code.selectionEnd = start + text.length;
  }

  // Accessibility: focus management for file menu
  fileBtn.addEventListener('keydown', e => {
    if(e.key === 'ArrowDown') {
      e.preventDefault();
      openFileMenuFocusFirst();
    }
  });
  function openFileMenuFocusFirst() {
    fileContainer.classList.add('open');
    fileBtn.setAttribute('aria-expanded', true);
    const firstMenuItem = fileSubmenu.querySelector('button');
    if(firstMenuItem) firstMenuItem.focus();
  }

  // Preferences modal (can be extended in future)
  themeBtn.addEventListener('dblclick', openPrefs);
  prefsCloseBtn.addEventListener('click', closePrefs);
  overlay.addEventListener('click', closePrefs);

  function openPrefs() {
    prefsModal.classList.add('show');
    overlay.classList.add('show');
    // Set current theme radio checked
    const radios = prefsForm.elements['theme'];
    for(let r of radios) {
      r.checked = r.value === currentTheme;
    }
  }
  function closePrefs() {
    prefsModal.classList.remove('show');
    overlay.classList.remove('show');
  }

  prefsForm.addEventListener('change', e => {
    if(e.target.name === 'theme') {
      currentTheme = e.target.value;
      document.body.className = currentTheme;
      localStorage.setItem('theme', currentTheme);
      updateThemeBtn();
    }
  });

})();
