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
    
    // Auto-focus the input box when the tool loads
    document.getElementById('math-input').focus();
});

// ==========================================
// 2. EXPRESSION EVALUATOR ENGINE
// ==========================================
const btnCalc = document.getElementById('btn-calc');
const btnClear = document.getElementById('btn-clear');
const mathInput = document.getElementById('math-input');
const resultBox = document.getElementById('calc-result');

function evaluateExpression() {
    const rawVal = mathInput.value.trim();

    if (!rawVal) {
        resultBox.innerHTML = '<span style="color: var(--text-secondary);">Please enter a mathematical expression.</span>';
        return;
    }

    try {
        // Use math.js to safely evaluate the expression
        // We use math.evaluate() which parses strings like "3 + 4 * (2 ^ 2)"
        let result = math.evaluate(rawVal);
        
        // Handle floating point weirdness (e.g., 0.1 + 0.2 = 0.30000000000000004)
        if (typeof result === 'number' && !Number.isInteger(result)) {
            // math.format helps clean up massive decimal tails
            result = math.format(result, { precision: 14 });
        }

        // Inject the success result
        resultBox.innerHTML = `
            <div style="text-transform: uppercase; font-size: 0.85rem; font-weight: 700; color: #94a3b8; letter-spacing: 1px; margin-bottom: 5px;">Result</div>
            <strong>${result}</strong>
        `;
    } catch (error) {
        // If the user typed invalid syntax (like "5 + * 3")
        resultBox.innerHTML = `
            <div style="text-transform: uppercase; font-size: 0.85rem; font-weight: 700; color: #ef4444; letter-spacing: 1px; margin-bottom: 5px;">Syntax Error</div>
            <strong class="error-text">Invalid Expression</strong>
            <div style="font-size: 0.9rem; margin-top: 5px; color: #cbd5e1;">Check your formatting and try again.</div>
        `;
    }
}

// Trigger calculation on button click
btnCalc.addEventListener('click', evaluateExpression);

// Trigger calculation when the user presses the 'Enter' key inside the input box
mathInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevents default form submission behavior
        evaluateExpression();
    }
});

// Clear Button Logic
btnClear.addEventListener('click', () => {
    mathInput.value = "";
    resultBox.innerHTML = '<span style="color: var(--text-secondary);">Your result will appear here.</span>';
    mathInput.focus();
});