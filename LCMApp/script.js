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
// 2. LCM CALCULATION ENGINE
// ==========================================

// Helper function: Find Greatest Common Divisor (GCD) using the Euclidean algorithm
const calculateGCD = (a, b) => {
    return b === 0 ? a : calculateGCD(b, a % b);
};

// Helper function: Find Least Common Multiple (LCM) of two numbers
const calculateLCM = (a, b) => {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / calculateGCD(a, b);
};

document.getElementById('btn-calc').addEventListener('click', () => {
    const inputVal = document.getElementById('lcm-input').value;
    const resultBox = document.getElementById('lcm-result');

    if (!inputVal.trim()) {
        resultBox.innerHTML = "Please enter some numbers separated by commas.";
        return;
    }

    // Convert the string into an array of clean integers
    const numbersArray = inputVal.split(',')
        .map(num => parseInt(num.trim(), 10))
        .filter(num => !isNaN(num));

    if (numbersArray.length < 2) {
        resultBox.innerHTML = "Please enter at least two valid numbers (e.g. 12, 15).";
        return;
    }

    // Use Array.reduce to calculate the LCM across all provided numbers
    const finalLCM = numbersArray.reduce((acc, currentVal) => calculateLCM(acc, currentVal));

    resultBox.innerHTML = `
        Numbers Calculated: ${numbersArray.join(', ')}<br>
        <strong>LCM: ${finalLCM}</strong>
    `;
});