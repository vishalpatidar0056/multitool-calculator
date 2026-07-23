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
// 2. JSON VALIDATOR ENGINE
// ==========================================
const btnValidate = document.getElementById('btn-validate');
const btnClear = document.getElementById('btn-clear');
const jsonInput = document.getElementById('json-input');

const resultBanner = document.getElementById('validation-result');
const statusIcon = document.getElementById('status-icon');
const statusTitle = document.getElementById('status-title');
const statusMessage = document.getElementById('status-message');

btnValidate.addEventListener('click', () => {
    const rawData = jsonInput.value.trim();
    
    // Hide banner while calculating
    resultBanner.style.display = 'none';
    resultBanner.className = 'result-banner'; // Reset classes

    if (!rawData) {
        alert("Please paste some JSON to validate.");
        return;
    }

    try {
        // Attempt to parse the JSON
        JSON.parse(rawData);
        
        // If it succeeds without throwing an error, it is valid
        statusIcon.innerHTML = "✓";
        statusTitle.innerText = "Valid JSON";
        statusMessage.innerText = "Syntax is fully correct and ready to use.";
        
        resultBanner.classList.add('valid');
        resultBanner.style.display = 'flex';
        
    } catch (error) {
        // If it fails, capture the error message
        statusIcon.innerHTML = "✕";
        statusTitle.innerText = "Invalid JSON";
        statusMessage.innerText = `Syntax Error: ${error.message}`;
        
        resultBanner.classList.add('invalid');
        resultBanner.style.display = 'flex';
    }
});

// Clear Input
btnClear.addEventListener('click', () => {
    jsonInput.value = "";
    resultBanner.style.display = 'none';
    jsonInput.focus();
});

// ==========================================
// 3. COPY TO CLIPBOARD LOGIC
// ==========================================
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-copy');
        const inputElement = document.getElementById(targetId);
        
        if (!inputElement.value) return; 

        inputElement.select();
        inputElement.setSelectionRange(0, 999999); 
        navigator.clipboard.writeText(inputElement.value);

        const originalText = btn.innerText;
        btn.innerText = "Copied!";
        btn.classList.add('success'); 
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove('success');
        }, 2000);
    });
});