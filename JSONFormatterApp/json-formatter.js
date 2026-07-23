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
// 2. JSON FORMATTER ENGINE
// ==========================================
const btnFormat = document.getElementById('btn-format');
const btnClear = document.getElementById('btn-clear');
const jsonInput = document.getElementById('json-input');
const jsonOutput = document.getElementById('json-output');
const errorBox = document.getElementById('error-msg');

btnFormat.addEventListener('click', () => {
    const rawData = jsonInput.value.trim();
    
    // Reset Error Box
    errorBox.style.display = 'none';
    errorBox.innerText = '';

    if (!rawData) {
        jsonOutput.value = "";
        return;
    }

    try {
        // Parse the raw string into a JavaScript Object
        const parsedJson = JSON.parse(rawData);
        
        // Stringify it back out with 4 spaces of indentation
        const formattedJson = JSON.stringify(parsedJson, null, 4);
        
        // Display the beautified result
        jsonOutput.value = formattedJson;
    } catch (error) {
        // If JSON is invalid, catch the error and display it to the user
        jsonOutput.value = "";
        errorBox.innerText = `Invalid JSON: ${error.message}`;
        errorBox.style.display = 'block';
        
        // Hide error message after 5 seconds
        setTimeout(() => {
            errorBox.style.display = 'none';
        }, 5000);
    }
});

// Clear input and output
btnClear.addEventListener('click', () => {
    jsonInput.value = "";
    jsonOutput.value = "";
    errorBox.style.display = 'none';
    jsonInput.focus();
});

// ==========================================
// 3. COPY TO CLIPBOARD LOGIC
// ==========================================
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-copy');
        const inputElement = document.getElementById(targetId);
        
        if (!inputElement.value) return; // Don't copy empty space

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