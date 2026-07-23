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
// 2. HTML FORMATTER ENGINE
// ==========================================
const btnFormat = document.getElementById('btn-format');
const btnClear = document.getElementById('btn-clear');
const htmlInput = document.getElementById('html-input');
const htmlOutput = document.getElementById('html-output');
const errorBox = document.getElementById('error-msg');

btnFormat.addEventListener('click', () => {
    const rawData = htmlInput.value.trim();
    
    // Reset Error Box
    errorBox.style.display = 'none';
    errorBox.innerText = '';

    if (!rawData) {
        htmlOutput.value = "";
        return;
    }

    try {
        // Use the html_beautify function from the js-beautify library
        const beautifiedHTML = html_beautify(rawData, {
            indent_size: 4,                  // Standard 4 space indentation
            indent_char: " ",                // Use spaces, not tabs
            max_preserve_newlines: 1,        // Don't allow massive vertical gaps
            preserve_newlines: true,
            keep_array_indentation: false,
            break_chained_methods: false,
            indent_scripts: "normal",
            brace_style: "collapse",
            space_before_conditional: true,
            unescape_strings: false,
            jslint_happy: false,
            end_with_newline: false,
            wrap_line_length: 0,             // 0 means do not wrap lines automatically
            indent_inner_html: false,
            comma_first: false,
            e4x: false,
            indent_empty_lines: false
        });
        
        // Display the perfectly formatted result
        htmlOutput.value = beautifiedHTML;
        
    } catch (error) {
        // Display the error if something goes completely wrong
        htmlOutput.value = "";
        errorBox.innerText = `Formatting Error: ${error.message}`;
        errorBox.style.display = 'block';
        
        setTimeout(() => {
            errorBox.style.display = 'none';
        }, 5000);
    }
});

// Clear input and output
btnClear.addEventListener('click', () => {
    htmlInput.value = "";
    htmlOutput.value = "";
    errorBox.style.display = 'none';
    htmlInput.focus();
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