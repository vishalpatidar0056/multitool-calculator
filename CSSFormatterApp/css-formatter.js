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
// 2. CSS FORMATTER ENGINE
// ==========================================
const btnFormat = document.getElementById('btn-format');
const btnClear = document.getElementById('btn-clear');
const cssInput = document.getElementById('css-input');
const cssOutput = document.getElementById('css-output');
const errorBox = document.getElementById('error-msg');

btnFormat.addEventListener('click', () => {
    const rawData = cssInput.value.trim();
    
    // Reset Error Box
    errorBox.style.display = 'none';
    errorBox.innerText = '';

    if (!rawData) {
        cssOutput.value = "";
        return;
    }

    try {
        // Use the css_beautify function from the js-beautify library
        const beautifiedCSS = css_beautify(rawData, {
            indent_size: 4,                  // Standard 4 space indentation
            indent_char: " ",                // Use spaces, not tabs
            preserve_newlines: true,
            max_preserve_newlines: 2,        // Limit huge empty spaces
            space_around_combinator: true,   // Adds space around >, +, ~
            newline_between_rules: true,     // Separates distinct rules with a blank line
            selector_separator_newline: true // Puts multiple selectors on their own lines
        });
        
        // Display the perfectly formatted result
        cssOutput.value = beautifiedCSS;
        
    } catch (error) {
        // Display the error if something goes wrong
        cssOutput.value = "";
        errorBox.innerText = `Formatting Error: ${error.message}`;
        errorBox.style.display = 'block';
        
        setTimeout(() => {
            errorBox.style.display = 'none';
        }, 5000);
    }
});

// Clear input and output
btnClear.addEventListener('click', () => {
    cssInput.value = "";
    cssOutput.value = "";
    errorBox.style.display = 'none';
    cssInput.focus();
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