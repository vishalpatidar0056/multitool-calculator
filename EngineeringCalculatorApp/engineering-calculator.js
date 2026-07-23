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
// 2. ENGINEERING ENGINE LOGIC
// ==========================================
const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');
const angleStatus = document.getElementById('angle-status');
const engStatus = document.getElementById('eng-status');
const buttons = document.querySelectorAll('.btn');

let currentInput = "0";
let isDegree = true;
let isEngMode = false;
let shouldResetDisplay = false;

// Custom Math Functions
const customMath = {
    sin: (x) => isDegree ? Math.sin(x * Math.PI / 180) : Math.sin(x),
    cos: (x) => isDegree ? Math.cos(x * Math.PI / 180) : Math.cos(x),
    tan: (x) => isDegree ? Math.tan(x * Math.PI / 180) : Math.tan(x),
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
        if (["÷", "×", "-", "+", "E"].includes(val)) {
            // Keep previous value if typing an operator immediately
            currentInput += val;
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
        case 'toggle-eng':
            isEngMode = !isEngMode;
            if (isEngMode) {
                engStatus.classList.remove('inactive');
            } else {
                engStatus.classList.add('inactive');
            }
            // If there's an active number, reformat it immediately
            if (currentInput !== "0" && currentInput !== "Error" && !isNaN(Number(currentInput))) {
                currentInput = formatNumber(Number(currentInput));
                updateDisplay();
            }
            break;
        case 'calculate':
            calculateResult();
            break;
    }
    updateDisplay();
}

function updateDisplay() {
    display.innerText = currentInput;
    display.scrollLeft = display.scrollWidth; 
}

// Formats number to Engineering Notation (Exponent is a multiple of 3)
function formatNumber(num) {
    if (num === 0) return "0";
    if (!isEngMode) {
        // Standard formatting with a cap on long decimals to prevent UI breakage
        let formatted = num.toPrecision(12);
        return parseFloat(formatted).toString(); 
    }

    // Force Engineering Notation logic
    let exponent = Math.floor(Math.log10(Math.abs(num)));
    let engExponent = Math.floor(exponent / 3) * 3;
    let mantissa = num / Math.pow(10, engExponent);
    
    // Clean up trailing zeros in mantissa
    mantissa = parseFloat(mantissa.toPrecision(6));

    if (engExponent === 0) return mantissa.toString();
    return `${mantissa}E${engExponent}`;
}

function calculateResult() {
    if (currentInput === "0" || currentInput === "Error") return;

    let expression = currentInput;
    historyDisplay.innerText = expression + " =";

    // 1. Auto-close missing parenthesis
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
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E');

    // Swap Prefixes and Constants
    evalStr = evalStr
        .replace(/µ/g, 'e-6')
        .replace(/m/g, 'e-3')
        .replace(/k/g, 'e3')
        .replace(/M/g, 'e6')
        .replace(/c/g, '299792458')        // Speed of Light (m/s)
        .replace(/g/g, '9.80665')          // Gravity (m/s^2)
        .replace(/G/g, '6.6743e-11')       // Gravitational Const
        .replace(/h/g, '6.62607015e-34');  // Planck Const

    // Handle the custom EXP button (treats it as *10^)
    evalStr = evalStr.replace(/E/g, 'e');

    // Safe Trig
    evalStr = evalStr
        .replace(/sin\(/g, 'customMath.sin(')
        .replace(/cos\(/g, 'customMath.cos(')
        .replace(/tan\(/g, 'customMath.tan(');

    try {
        let result = new Function('customMath', 'return ' + evalStr)(customMath);

        if (isNaN(result) || !isFinite(result)) {
            throw new Error("Math Error");
        }

        currentInput = formatNumber(result);
        shouldResetDisplay = true;

    } catch (error) {
        currentInput = "Error";
        shouldResetDisplay = true;
    }
    
    updateDisplay();
}