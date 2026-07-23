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
// 2. RATIO CALCULATOR ENGINE
// ==========================================

// Utility to format long decimals gracefully
function formatResult(num) {
    if (isNaN(num) || !isFinite(num)) return "";
    // If it's an integer, show as is. If decimal, round to max 4 places.
    return Number.isInteger(num) ? num.toString() : parseFloat(num.toFixed(4)).toString();
}

// Utility to find the Greatest Common Divisor (GCD) for simplifying
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// --- Calculator 1: Equivalent Ratio (A/B = C/X) ---
const c1_a = document.getElementById('calc1-a');
const c1_b = document.getElementById('calc1-b');
const c1_c = document.getElementById('calc1-c');
const c1_res = document.getElementById('calc1-res');

function calculateEquivalent() {
    const a = parseFloat(c1_a.value);
    const b = parseFloat(c1_b.value);
    const c = parseFloat(c1_c.value);
    
    if (!isNaN(a) && !isNaN(b) && !isNaN(c) && a !== 0) {
        // Formula: X = (B * C) / A
        const x = (b * c) / a;
        c1_res.value = formatResult(x);
    } else {
        c1_res.value = "";
    }
}
c1_a.addEventListener('input', calculateEquivalent);
c1_b.addEventListener('input', calculateEquivalent);
c1_c.addEventListener('input', calculateEquivalent);


// --- Calculator 2: Simplify Ratio ---
const c2_a = document.getElementById('calc2-a');
const c2_b = document.getElementById('calc2-b');
const c2_res = document.getElementById('calc2-result');

function calculateSimplified() {
    const a = parseFloat(c2_a.value);
    const b = parseFloat(c2_b.value);
    
    if (!isNaN(a) && !isNaN(b) && Number.isInteger(a) && Number.isInteger(b) && a !== 0 && b !== 0) {
        const divisor = gcd(a, b);
        const simplifiedA = a / divisor;
        const simplifiedB = b / divisor;
        c2_res.innerText = `${simplifiedA} : ${simplifiedB}`;
    } else {
        c2_res.innerText = "0 : 0";
    }
}
c2_a.addEventListener('input', calculateSimplified);
c2_b.addEventListener('input', calculateSimplified);


// --- Calculator 3: Divide Amount by Ratio ---
const c3_total = document.getElementById('calc3-total');
const c3_ratio = document.getElementById('calc3-ratio');
const c3_res = document.getElementById('calc3-result');

function calculateDivision() {
    const total = parseFloat(c3_total.value);
    const ratioStr = c3_ratio.value.trim();
    
    if (isNaN(total) || !ratioStr) {
        c3_res.innerText = "0";
        return;
    }

    // Split the ratio string by colons and convert to numbers
    const parts = ratioStr.split(':').map(part => parseFloat(part.trim()));
    
    // Validate that all parts are actually numbers and greater than 0
    const isValid = parts.every(part => !isNaN(part) && part > 0);
    
    if (isValid && parts.length > 1) {
        // Find total number of shares
        const totalShares = parts.reduce((sum, current) => sum + current, 0);
        
        // Calculate the value of each share
        const shareValues = parts.map(part => formatResult((total / totalShares) * part));
        
        // Join them back together with a visual separator
        c3_res.innerText = shareValues.join(" • ");
    } else {
        c3_res.innerText = "0";
    }
}
c3_total.addEventListener('input', calculateDivision);
c3_ratio.addEventListener('input', calculateDivision);