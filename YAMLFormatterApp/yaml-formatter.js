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
// 2. YAML FORMATTER ENGINE
// ==========================================
const btnFormat = document.getElementById('btn-format');
const btnClear = document.getElementById('btn-clear');
const yamlInput = document.getElementById('yaml-input');
const yamlOutput = document.getElementById('yaml-output');
const errorBox = document.getElementById('error-msg');

btnFormat.addEventListener('click', () => {
    const rawData = yamlInput.value.trim();
    
    // Reset Error Box
    errorBox.style.display = 'none';
    errorBox.innerText = '';

    if (!rawData) {
        yamlOutput.value = "";
        return;
    }

    try {
        // Step 1: Parse the raw YAML into a JavaScript Object using js-yaml library
        const parsedObject = jsyaml.load(rawData);
        
        // Step 2: Dump the object back into a perfectly formatted YAML string
        // We set indent to 2 spaces (standard for YAML) and ensure it handles arrays nicely
        const beautifiedYAML = jsyaml.dump(parsedObject, {
            indent: 2,
            lineWidth: -1, // Prevents long lines from folding automatically
            noRefs: true   // Prevents object reference aliases
        });
        
        // Display the beautified result
        yamlOutput.value = beautifiedYAML;
        
    } catch (error) {
        // Display the error
        yamlOutput.value = "";
        errorBox.innerText = `Invalid YAML: ${error.message}`;
        errorBox.style.display = 'block';
        
        setTimeout(() => {
            errorBox.style.display = 'none';
        }, 5000);
    }
});

// Clear input and output
btnClear.addEventListener('click', () => {
    yamlInput.value = "";
    yamlOutput.value = "";
    errorBox.style.display = 'none';
    yamlInput.focus();
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