// ==========================================
// 1. ISOLATED THEME TOGGLE
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
            if (document.body.classList.contains('light-theme')) {
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
// 2. SCIENTIFIC ENGINE LOGIC
// ==========================================
const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');
const angleStatus = document.getElementById('angle-status');
const buttons = document.querySelectorAll('.btn');

let currentInput = "0";
let isDegree = true;
let lastAnswer = "0";
let shouldResetDisplay = false;

// Custom Math Functions to inject into evaluation
const customMath = {
    // Converts degrees to radians if necessary
    sin: (x) => isDegree ? Math.sin(x * Math.PI / 180) : Math.sin(x),
    cos: (x) => isDegree ? Math.cos(x * Math.PI / 180) : Math.cos(x),
    tan: (x) => isDegree ? Math.tan(x * Math.PI / 180) : Math.tan(x),
    log: (x) => Math.log10(x),
    ln: (x) => Math.log(x),
    sqrt: (x) => Math.sqrt(x),
    fact: function(n) {
        if (n < 0 || !Number.isInteger(n)) return NaN; // Factorials only work on positive integers
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    }
};

// Listen to all buttons
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-val');
        const action = btn.getAttribute('data-action');

        if (action) {
            handleAction(action, btn);
        } else if (value) {
            handleInput(value);
        }
    });
});

function handleInput(val) {
    if (currentInput === "0" || currentInput === "Error" || shouldResetDisplay) {
        if (["÷", "×", "-", "+", "^"].includes(val)) {
            // If starting with an operator, keep the previous answer
            currentInput = lastAnswer + val; 
        } else {
            currentInput = val;
        }
        shouldResetDisplay = false;
    } else {
        currentInput += val;
    }
    updateDisplay();
}

function handleAction(action, btn) {
    switch (action) {
        case 'clear':
            currentInput = "0";
            historyDisplay.innerText = "";
            break;
        case 'delete':
            if (currentInput !== "0" && currentInput !== "Error") {
                currentInput = currentInput.slice(0, -1);
                if (currentInput === "") currentInput = "0";
            }
            break;
        case 'toggle-angle':
            isDegree = !isDegree;
            btn.innerText = isDegree ? "DEG" : "RAD";
            angleStatus.innerText = isDegree ? "DEG" : "RAD";
            break;
        case 'calculate':
            calculateResult();
            break;
    }
    updateDisplay();
}

function updateDisplay() {
    display.innerText = currentInput;
    // Auto-scroll to the right so typing long equations always stays in view
    display.scrollLeft = display.scrollWidth; 
}

function calculateResult() {
    if (currentInput === "0" || currentInput === "Error") return;

    let expression = currentInput;
    historyDisplay.innerText = expression + " =";

    // 1. Auto-close missing parenthesis so it doesn't crash
    let openParens = (expression.match(/\(/g) || []).length;
    let closeParens = (expression.match(/\)/g) || []).length;
    while (openParens > closeParens) {
        expression += ")";
        closeParens++;
    }

    // 2. Format the string for JavaScript evaluation
    let evalStr = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/ANS/g, lastAnswer);

    // Map trig and logarithms to our custom safe functions
    evalStr = evalStr
        .replace(/sin\(/g, 'customMath.sin(')
        .replace(/cos\(/g, 'customMath.cos(')
        .replace(/tan\(/g, 'customMath.tan(')
        .replace(/log\(/g, 'customMath.log(')
        .replace(/ln\(/g, 'customMath.ln(')
        .replace(/√\(/g, 'customMath.sqrt(');

    // Replace Factorials (Finds any number followed by '!' and wraps it in the customMath.fact function)
    evalStr = evalStr.replace(/(\d+(\.\d+)?)!/g, 'customMath.fact($1)');

    try {
        // Execute the mathematical string safely using Function constructor
        let result = new Function('customMath', 'return ' + evalStr)(customMath);
        
        // Handle decimals to prevent massive trailing numbers (e.g. 0.1 + 0.2 = 0.30000000000000004)
        if (!Number.isInteger(result)) {
            result = parseFloat(result.toPrecision(12));
        }

        if (isNaN(result) || !isFinite(result)) {
            throw new Error("Math Error");
        }

        currentInput = result.toString();
        lastAnswer = currentInput;
        shouldResetDisplay = true;

    } catch (error) {
        currentInput = "Error";
        shouldResetDisplay = true;
    }
    
    updateDisplay();
}