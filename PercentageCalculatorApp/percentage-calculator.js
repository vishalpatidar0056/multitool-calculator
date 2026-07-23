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
// 2. PERCENTAGE CALCULATOR ENGINE
// ==========================================

// Utility function to format numbers cleanly (max 4 decimal places, removes trailing zeros)
function formatResult(num) {
    if (isNaN(num) || !isFinite(num)) return "0";
    return parseFloat(num.toFixed(4)).toString();
}

// --- Calculator 1: What is X% of Y? ---
const c1_x = document.getElementById('calc1-x');
const c1_y = document.getElementById('calc1-y');
const c1_res = document.getElementById('calc1-result');

function calculateCard1() {
    const x = parseFloat(c1_x.value);
    const y = parseFloat(c1_y.value);
    
    if (!isNaN(x) && !isNaN(y)) {
        const result = (x / 100) * y;
        c1_res.innerText = formatResult(result);
    } else {
        c1_res.innerText = "0";
    }
}
c1_x.addEventListener('input', calculateCard1);
c1_y.addEventListener('input', calculateCard1);


// --- Calculator 2: X is what % of Y? ---
const c2_x = document.getElementById('calc2-x');
const c2_y = document.getElementById('calc2-y');
const c2_res = document.getElementById('calc2-result');

function calculateCard2() {
    const x = parseFloat(c2_x.value);
    const y = parseFloat(c2_y.value);
    
    if (!isNaN(x) && !isNaN(y) && y !== 0) {
        const result = (x / y) * 100;
        c2_res.innerText = formatResult(result) + "%";
    } else {
        c2_res.innerText = "0%";
    }
}
c2_x.addEventListener('input', calculateCard2);
c2_y.addEventListener('input', calculateCard2);


// --- Calculator 3: Percentage Change (Increase/Decrease) ---
const c3_x = document.getElementById('calc3-x');
const c3_y = document.getElementById('calc3-y');
const c3_res = document.getElementById('calc3-result');

function calculateCard3() {
    const x = parseFloat(c3_x.value);
    const y = parseFloat(c3_y.value);
    
    // Reset colors
    c3_res.classList.remove('increase', 'decrease');
    
    if (!isNaN(x) && !isNaN(y) && x !== 0) {
        const result = ((y - x) / Math.abs(x)) * 100;
        const formatted = formatResult(Math.abs(result));
        
        if (result > 0) {
            c3_res.innerText = "+" + formatted + "%";
            c3_res.classList.add('increase');
        } else if (result < 0) {
            c3_res.innerText = "-" + formatted + "%";
            c3_res.classList.add('decrease');
        } else {
            c3_res.innerText = "0%";
        }
    } else {
        c3_res.innerText = "0%";
    }
}
c3_x.addEventListener('input', calculateCard3);
c3_y.addEventListener('input', calculateCard3);