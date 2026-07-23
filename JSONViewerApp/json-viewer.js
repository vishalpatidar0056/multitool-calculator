// ==========================================
// 1. ISOLATED THEME TOGGLE (Standardized)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    if (themeToggle && themeIcon) {
        if (localStorage.getItem('multitool-theme') === 'light') {
            document.body.classList.add('light-theme');
            themeIcon.src = '../icons/dark-mode.png';
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            
            if (isLight) {
                themeIcon.src = '../icons/dark-mode.png'; 
                localStorage.setItem('multitool-theme', 'light');
            } else {
                themeIcon.src = '../icons/light-mode.png'; 
                localStorage.setItem('multitool-theme', 'dark');
            }
        });
    }
});

// ==========================================
// 2. JSON VIEWER TREE ENGINE
// ==========================================
const btnView = document.getElementById('btn-view');
const btnClear = document.getElementById('btn-clear');
const btnExpand = document.getElementById('btn-expand');
const btnCollapse = document.getElementById('btn-collapse');
const jsonInput = document.getElementById('json-input');
const viewerOutput = document.getElementById('viewer-output');
const errorBox = document.getElementById('error-msg');

// Recursive function to build the interactive HTML tree
function buildTree(key, value, isLast) {
    let html = '';
    const keyHTML = key !== null ? `<span class="json-key">"${key}"</span><span class="json-bracket">:</span> ` : '';
    const comma = isLast ? '' : '<span class="json-bracket">,</span>';

    if (value === null) {
        html += `<div class="json-line">${keyHTML}<span class="json-null">null</span>${comma}</div>`;
    } else if (typeof value === 'string') {
        html += `<div class="json-line">${keyHTML}<span class="json-string">"${value}"</span>${comma}</div>`;
    } else if (typeof value === 'number') {
        html += `<div class="json-line">${keyHTML}<span class="json-number">${value}</span>${comma}</div>`;
    } else if (typeof value === 'boolean') {
        html += `<div class="json-line">${keyHTML}<span class="json-boolean">${value}</span>${comma}</div>`;
    } else if (Array.isArray(value)) {
        if (value.length === 0) {
            html += `<div class="json-line">${keyHTML}<span class="json-bracket">[]</span>${comma}</div>`;
        } else {
            html += `<details open><summary>${keyHTML}<span class="json-bracket">[</span></summary><div class="json-children">`;
            value.forEach((item, index) => {
                html += buildTree(null, item, index === value.length - 1);
            });
            html += `</div><span class="json-bracket">]</span>${comma}</details>`;
        }
    } else if (typeof value === 'object') {
        const keys = Object.keys(value);
        if (keys.length === 0) {
            html += `<div class="json-line">${keyHTML}<span class="json-bracket">{}</span>${comma}</div>`;
        } else {
            html += `<details open><summary>${keyHTML}<span class="json-bracket">{</span></summary><div class="json-children">`;
            keys.forEach((k, index) => {
                html += buildTree(k, value[k], index === keys.length - 1);
            });
            html += `</div><span class="json-bracket">}</span>${comma}</details>`;
        }
    }
    return html;
}

// Generate the view
btnView.addEventListener('click', () => {
    const rawData = jsonInput.value.trim();
    
    errorBox.style.display = 'none';

    if (!rawData) {
        viewerOutput.innerHTML = '<span style="color: var(--text-secondary);">Waiting for JSON data...</span>';
        return;
    }

    try {
        const parsedJson = JSON.parse(rawData);
        // Wrap the root object in the tree builder
        viewerOutput.innerHTML = `<div style="padding-left: 5px;">${buildTree(null, parsedJson, true)}</div>`;
    } catch (error) {
        viewerOutput.innerHTML = '<span style="color: #ef4444;">Failed to render. Fix syntax errors to view tree.</span>';
        errorBox.innerText = `Invalid JSON: ${error.message}`;
        errorBox.style.display = 'block';
        
        setTimeout(() => { errorBox.style.display = 'none'; }, 5000);
    }
});

// Controls
btnClear.addEventListener('click', () => {
    jsonInput.value = "";
    viewerOutput.innerHTML = '<span style="color: var(--text-secondary);">Waiting for JSON data...</span>';
    errorBox.style.display = 'none';
    jsonInput.focus();
});

btnExpand.addEventListener('click', () => {
    const details = viewerOutput.querySelectorAll('details');
    details.forEach(detail => detail.setAttribute('open', 'true'));
});

btnCollapse.addEventListener('click', () => {
    const details = viewerOutput.querySelectorAll('details');
    details.forEach(detail => detail.removeAttribute('open'));
});